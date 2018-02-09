(function (app) {
  'use strict';

  app.registerModule('core', ['ui.bootstrap.datetimepicker']);
  app.registerModule('core.routes', ['ui.router']);
  app.registerModule('core.admin', ['core']);
  app.registerModule('core.admin.routes', ['ui.router']);
  app.registerModule('core.technician', ['core']);
  app.registerModule('core.technician.routes', ['ui.router']);
}(ApplicationConfiguration));
