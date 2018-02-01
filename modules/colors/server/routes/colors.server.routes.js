'use strict';

/**
 * Module dependencies
 */
var colorsPolicy = require('../policies/colors.server.policy'),
  colors = require('../controllers/colors.server.controller');

module.exports = function (app) {
  // Colors collection routes
  app.route('/api/colors').all(colorsPolicy.isAllowed)
    .get(colors.list)
    .post(colors.create);

  // Single color routes
  app.route('/api/colors/:colorId').all(colorsPolicy.isAllowed)
    .get(colors.read)
    .put(colors.update)
    .delete(colors.delete);

  // Finish by binding the color middleware
  app.param('colorId', colors.colorByID);
};
