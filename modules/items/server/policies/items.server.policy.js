'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Items Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/items',
      permissions: '*'
    }, {
      resources: '/api/items/:itemId',
      permissions: '*'
    }, {
      resources: '/api/items/open',
      permissions: '*'
    }, {
      resources: '/api/items/open/:itemId',
      permissions: '*'
    }, {
      resources: '/api/items/close',
      permissions: '*'
    }, {
      resources: '/api/items/close/:itemId',
      permissions: '*'
    }]
  }, {
    roles: ['technician'],
    allows: [{
      resources: '/api/items',
      permissions: ['get']
    }, {
      resources: '/api/items/:itemId',
      permissions: ['get, put']
    }, {
      resources: '/api/items/open',
      permissions: ['get']
    }, {
      resources: '/api/items/open/:itemId',
      permissions: ['get, put']
    }, {
      resources: '/api/items/close',
      permissions: ['get']
    }, {
      resources: '/api/items/close/:itemId',
      permissions: ['get, put']
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/items',
      permissions: ['get']
    }, {
      resources: '/api/items/:itemId',
      permissions: ['get']
    }, {
      resources: '/api/items/open',
      permissions: ['get']
    }, {
      resources: '/api/items/open/:itemId',
      permissions: ['get']
    }, {
      resources: '/api/items/close',
      permissions: ['get']
    }, {
      resources: '/api/items/close/:itemId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Items Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an item is being processed and the current user created it then allow any manipulation
  if (req.item && req.user && req.item.user && req.item.user.id === req.user.id) {
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
