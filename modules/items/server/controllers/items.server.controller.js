'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Item = mongoose.model('Item'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
var _ = require('lodash');

/**
 * Create an item
 */
exports.create = function (req, res) {
  var item = new Item(req.body);
  item.user = req.user;

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Show the current item
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var item = req.item ? req.item.toJSON() : {};

  // Add a custom field to the Item, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Item model.
  item.isCurrentUserOwner = !!(req.user && item.user && item.user._id.toString() === req.user._id.toString());

  res.json(item);
};

/**
 * Update an item
 */
exports.update = function (req, res) {
  var item = req.item;

  item.owner = req.body.owner;
  item.model = req.body.model;
  item.serialNumber = req.body.serialNumber;
  item.description = req.body.description;
  item.color = req.body.color;
  item.registrationDate = req.body.registrationDate;
  item.resolutions = req.body.resolutions;
  item.status = req.body.status;
  item.observations = req.body.observations;
  item.waranty = req.body.waranty;
  item.revisionCost = req.body.revisionCost;
  item.store = req.body.store;

  item.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * Delete an item
 */
exports.delete = function (req, res) {
  var item = req.item;

  item.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(item);
    }
  });
};

/**
 * List of Items
 */
exports.list = function (req, res) {
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }

  Item.find(query).sort('-registrationDate').populate('user', 'displayName')
    .populate({
      path: 'model',
      populate: {
        path: 'brand'
      }
    })
    .populate('store', 'name')
    .populate('resolutions.technician')
    .populate('color')
    .exec(function (err, items) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(items);
      }
    });
};

/**
 * List of Open Items
 */
exports.listAllOpen = function (req, res) {
  var query = _.forEach(req.query, function (value, key) {
    var queryParam = {
      $regex: new RegExp('^' + value + '$', 'i'),
      $options: 'i'
    };
    req.query[key] = _.zipObject([key], [queryParam]);
  });

  if (!_.isEmpty(query)) {
    query = {
      $and: _.toArray(query)
    };
  }
  Item.find(query)
    .where({ 'status': { $ne: 'Cerrado - Entregado' } })
    .where({ 'status': { $ne: 'Cerrado - Desechado' } })
    .sort('-registrationDate').populate('user', 'displayName')
    .populate({
      path: 'model',
      populate: {
        path: 'brand'
      }
    })
    .populate('store', 'name')
    .populate('resolutions.technician')
    .populate('color')
    .exec(function (err, items) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(items);
      }
    });
};

/**
 * Item middleware
 */
exports.itemByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Item is invalid'
    });
  }

  Item.findById(id).populate('user', 'displayName')
    .populate({
      path: 'model',
      populate: {
        path: 'brand'
      }
    })
    .populate('store', 'name')
    .populate('resolutions.technician')
    .populate('color')
    .exec(function (err, item) {
      if (err) {
        return next(err);
      } else if (!item) {
        return res.status(404).send({
          message: 'No item with that identifier has been found'
        });
      }
      req.item = item;
      next();
    });
};
