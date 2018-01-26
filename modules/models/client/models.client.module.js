(function (app) {
  'use strict';

  app.registerModule('models', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('models.admin', ['core.admin']);
  app.registerModule('models.admin.routes', ['core.admin.routes']);
  app.registerModule('models.services');
  app.registerModule('models.routes', ['ui.router', 'core.routes', 'models.services']);
}(ApplicationConfiguration));
