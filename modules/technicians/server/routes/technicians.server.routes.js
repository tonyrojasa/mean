'use strict';

/**
 * Module dependencies
 */
var techniciansPolicy = require('../policies/technicians.server.policy'),
  technicians = require('../controllers/technicians.server.controller');

module.exports = function (app) {
  // Technicians collection routes
  app.route('/api/technicians').all(techniciansPolicy.isAllowed)
    .get(technicians.list)
    .post(technicians.create);

  // Single technician routes
  app.route('/api/technicians/:technicianId').all(techniciansPolicy.isAllowed)
    .get(technicians.read)
    .put(technicians.update)
    .delete(technicians.delete);

  // Finish by binding the technician middleware
  app.param('technicianId', technicians.technicianByID);
};
