(function (app) {
  'use strict';

  app.registerModule('technicians', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('technicians.admin', ['core.admin']);
  app.registerModule('technicians.admin.routes', ['core.admin.routes']);
  app.registerModule('technicians.services');
  app.registerModule('technicians.routes', ['ui.router', 'core.routes', 'technicians.services']);
}(ApplicationConfiguration));
