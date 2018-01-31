'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Technician = mongoose.model('Technician'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an technician
 */
exports.create = function (req, res) {
  var technician = new Technician(req.body);
  technician.user = req.user;

  technician.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(technician);
    }
  });
};

/**
 * Show the current technician
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var technician = req.technician ? req.technician.toJSON() : {};

  // Add a custom field to the Technician, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Technician model.
  technician.isCurrentUserOwner = !!(req.user && technician.user && technician.user._id.toString() === req.user._id.toString());

  res.json(technician);
};

/**
 * Update an technician
 */
exports.update = function (req, res) {
  var technician = req.technician;

  technician.name = req.body.name;
  technician.workshop = req.body.workshop;
  technician.mobilePhone = req.body.mobilePhone;
  technician.otherPhone = req.body.otherPhone;
  technician.email = req.body.email;
  technician.description = req.body.description;

  technician.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(technician);
    }
  });
};

/**
 * Delete an technician
 */
exports.delete = function (req, res) {
  var technician = req.technician;

  technician.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(technician);
    }
  });
};

/**
 * List of Technicians
 */
exports.list = function (req, res) {
  Technician.find().sort('-created').populate('user', 'displayName')
    .populate('workshop', 'name')
    .exec(function (err, technicians) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(technicians);
      }
    });
};

/**
 * Technician middleware
 */
exports.technicianByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Technician is invalid'
    });
  }

  Technician.findById(id).populate('user', 'displayName')
    .populate('workshop', 'name')
    .exec(function (err, technician) {
      if (err) {
        return next(err);
      } else if (!technician) {
        return res.status(404).send({
          message: 'No technician with that identifier has been found'
        });
      }
      req.technician = technician;
      next();
    });
};
