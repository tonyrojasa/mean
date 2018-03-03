'use strict';

/**
 * Module dependencies
 */
var itemsPolicy = require('../policies/items.server.policy'),
  items = require('../controllers/items.server.controller');

module.exports = function (app) {
  // Items collection routes
  app.route('/api/items').all(itemsPolicy.isAllowed)
    .get(items.list)
    .post(items.create);

  app.route('/api/items/open').all(itemsPolicy.isAllowed)
    .get(items.listAllOpen)
    .post(items.create);

  app.route('/api/items/close').all(itemsPolicy.isAllowed)
    .get(items.listAllClose)
    .post(items.create);

  // Single item routes
  app.route('/api/items/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);
  app.route('/api/items/open/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);
  app.route('/api/items/workshop/:workshopId').all(itemsPolicy.isAllowed)
    .get(items.listAllWorkshop)
    .put(items.update)
    .delete(items.delete);
  app.route('/api/items/close/:itemId').all(itemsPolicy.isAllowed)
    .get(items.read)
    .put(items.update)
    .delete(items.delete);

  // Finish by binding the item middleware
  app.param('itemId', items.itemByID);
};
