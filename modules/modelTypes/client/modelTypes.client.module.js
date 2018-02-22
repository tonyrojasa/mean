(function (app) {
  'use strict';

  app.registerModule('modelTypes', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('modelTypes.admin', ['core.admin']);
  app.registerModule('modelTypes.admin.routes', ['core.admin.routes']);
  app.registerModule('modelTypes.services');
  app.registerModule('modelTypes.routes', ['ui.router', 'core.routes', 'modelTypes.services']);
}(ApplicationConfiguration));
