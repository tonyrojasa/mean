'use strict';

/**
 * Module dependencies
 */
var modelsPolicy = require('../policies/models.server.policy'),
  models = require('../controllers/models.server.controller');

module.exports = function (app) {
  // Models collection routes
  app.route('/api/models').all(modelsPolicy.isAllowed)
    .get(models.list)
    .post(models.create);

  // Single model routes
  app.route('/api/models/:modelId').all(modelsPolicy.isAllowed)
    .get(models.read)
    .put(models.update)
    .delete(models.delete);

  // Finish by binding the model middleware
  app.param('modelId', models.modelByID);
};
