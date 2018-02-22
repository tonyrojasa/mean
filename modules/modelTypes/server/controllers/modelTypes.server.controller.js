'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ModelType = mongoose.model('ModelType'),
  Model = mongoose.model('Model'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an modelType
 */
exports.create = function (req, res) {
  var modelType = new ModelType(req.body);
  modelType.user = req.user;

  modelType.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modelType);
    }
  });
};

/**
 * Show the current modelType
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var modelType = req.modelType ? req.modelType.toJSON() : {};

  // Add a custom field to the ModelType, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the ModelType model.
  modelType.isCurrentUserOwner = !!(req.user && modelType.user && modelType.user._id.toString() === req.user._id.toString());

  res.json(modelType);
};

/**
 * Update an modelType
 */
exports.update = function (req, res) {
  var modelType = req.modelType;

  modelType.name = req.body.name;
  modelType.description = req.body.description;

  modelType.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modelType);
    }
  });
};

/**
 * Delete an modelType
 */
exports.delete = function (req, res) {
  var modelType = req.modelType;
  var idUser = req.user;

  Model.aggregate([
    { '$match': { 'modelType': modelType._id } }
  ], function (err, items) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else if (items.length > 0) {
      return res.status(422).send({
        message: 'document is used'
      });
    } else {
      modelType.delete(idUser, function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(modelType);
        }
      });
    }
  });
};

/**
 * List of ModelTypes
 */
exports.list = function (req, res) {
  ModelType.find().sort('-created').populate('user', 'displayName').exec(function (err, modelTypes) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(modelTypes);
    }
  });
};

/**
 * ModelType middleware
 */
exports.modelTypeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ModelType is invalid'
    });
  }

  ModelType.findById(id).populate('user', 'displayName').exec(function (err, modelType) {
    if (err) {
      return next(err);
    } else if (!modelType) {
      return res.status(404).send({
        message: 'No modelType with that identifier has been found'
      });
    }
    req.modelType = modelType;
    next();
  });
};
