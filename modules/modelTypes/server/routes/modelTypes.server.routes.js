'use strict';

/**
 * Module dependencies
 */
var modelTypesPolicy = require('../policies/modelTypes.server.policy'),
  modelTypes = require('../controllers/modelTypes.server.controller');

module.exports = function (app) {
  // ModelTypes collection routes
  app.route('/api/modelTypes').all(modelTypesPolicy.isAllowed)
    .get(modelTypes.list)
    .post(modelTypes.create);

  // Single modelType routes
  app.route('/api/modelTypes/:modelTypeId').all(modelTypesPolicy.isAllowed)
    .get(modelTypes.read)
    .put(modelTypes.update)
    .delete(modelTypes.delete);

  // Finish by binding the modelType middleware
  app.param('modelTypeId', modelTypes.modelTypeByID);
};
