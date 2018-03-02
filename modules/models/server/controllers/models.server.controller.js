'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Model = mongoose.model('Model'),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an model
 */
exports.create = function (req, res) {
  var model = new Model(req.body);
  model.user = req.user;

  model.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(model);
    }
  });
};

/**
 * Show the current model
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var model = req.model ? req.model.toJSON() : {};

  // Add a custom field to the Model, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Model model.
  model.isCurrentUserOwner = !!(req.user && model.user && model.user._id.toString() === req.user._id.toString());

  res.json(model);
};

/**
 * Update an model
 */
exports.update = function (req, res) {
  var model = req.model;

  model.name = req.body.name;
  model.brand = req.body.brand;
  model.modelType = req.body.modelType;
  model.description = req.body.description;

  model.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(model);
    }
  });
};

/**
 * Delete an model
 */
exports.delete = function (req, res) {
  var model = req.model;
  var idUser = req.user;

  Item.aggregate([
    { '$match': { 'model': model._id } }
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
      model.delete(idUser, function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(model);
        }
      });
    }
  });
};

/**
 * List of Models
 */
exports.list = function (req, res) {
  Model.find().sort('-name')
    .populate('user', 'displayName')
    .populate('brand', 'name')
    .populate('modelType', 'name')
    .exec(function (err, models) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(models);
      }
    });
};

/**
 * Model middleware
 */
exports.modelByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Model is invalid'
    });
  }

  Model.findById(id).populate('user', 'displayName')
    .populate('brand', 'name')
    .populate('modelType', 'name')
    .exec(function (err, model) {
      if (err) {
        return next(err);
      } else if (!model) {
        return res.status(404).send({
          message: 'No model with that identifier has been found'
        });
      }
      req.model = model;
      next();
    });
};
