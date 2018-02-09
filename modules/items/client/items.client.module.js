(function (app) {
  'use strict';

  app.registerModule('items', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('items.admin', ['core.admin']);
  app.registerModule('items.admin.routes', ['core.admin.routes']);
  app.registerModule('items.technician', ['core.technician']);
  app.registerModule('items.technician.routes', ['core.technician.routes']);
  app.registerModule('items.services');
  app.registerModule('items.routes', ['ui.router', 'core.routes', 'items.services']);
}(ApplicationConfiguration));
