'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Technicians Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/technicians',
      permissions: '*'
    }, {
      resources: '/api/technicians/:technicianId',
      permissions: '*'
    }]
  }, {
    roles: ['user', 'technician'],
    allows: [{
      resources: '/api/technicians',
      permissions: ['get']
    }, {
      resources: '/api/technicians/:technicianId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/technicians',
      permissions: ['get']
    }, {
      resources: '/api/technicians/:technicianId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Technicians Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an technician is being processed and the current user created it then allow any manipulation
  if (req.technician && req.user && req.technician.user && req.technician.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
