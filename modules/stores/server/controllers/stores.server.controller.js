'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Store = mongoose.model('Store'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an store
 */
exports.create = function (req, res) {
  var store = new Store(req.body);
  store.user = req.user;

  store.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(store);
    }
  });
};

/**
 * Show the current store
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var store = req.store ? req.store.toJSON() : {};

  // Add a custom field to the Store, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Store model.
  store.isCurrentUserOwner = !!(req.user && store.user && store.user._id.toString() === req.user._id.toString());

  res.json(store);
};

/**
 * Update an store
 */
exports.update = function (req, res) {
  var store = req.store;

  store.title = req.body.title;
  store.content = req.body.content;

  store.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(store);
    }
  });
};

/**
 * Delete an store
 */
exports.delete = function (req, res) {
  var store = req.store;

  store.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(store);
    }
  });
};

/**
 * List of Stores
 */
exports.list = function (req, res) {
  Store.find().sort('-created').populate('user', 'displayName').exec(function (err, stores) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(stores);
    }
  });
};

/**
 * Store middleware
 */
exports.storeByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Store is invalid'
    });
  }

  Store.findById(id).populate('user', 'displayName').exec(function (err, store) {
    if (err) {
      return next(err);
    } else if (!store) {
      return res.status(404).send({
        message: 'No store with that identifier has been found'
      });
    }
    req.store = store;
    next();
  });
};
