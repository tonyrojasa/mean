'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Color = mongoose.model('Color'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an color
 */
exports.create = function (req, res) {
  var color = new Color(req.body);
  color.user = req.user;

  color.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(color);
    }
  });
};

/**
 * Show the current color
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var color = req.color ? req.color.toJSON() : {};

  // Add a custom field to the Color, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Color model.
  color.isCurrentUserOwner = !!(req.user && color.user && color.user._id.toString() === req.user._id.toString());

  res.json(color);
};

/**
 * Update an color
 */
exports.update = function (req, res) {
  var color = req.color;

  color.name = req.body.name;
  color.code = req.body.code;

  color.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(color);
    }
  });
};

/**
 * Delete an color
 */
exports.delete = function (req, res) {
  var color = req.color;

  color.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(color);
    }
  });
};

/**
 * List of Colors
 */
exports.list = function (req, res) {
  Color.find().sort('-created').populate('user', 'displayName').exec(function (err, colors) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(colors);
    }
  });
};

/**
 * Color middleware
 */
exports.colorByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Color is invalid'
    });
  }

  Color.findById(id).populate('user', 'displayName').exec(function (err, color) {
    if (err) {
      return next(err);
    } else if (!color) {
      return res.status(404).send({
        message: 'No color with that identifier has been found'
      });
    }
    req.color = color;
    next();
  });
};
