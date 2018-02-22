(function () {
  'use strict';

  // Configuring the ModelTypes Admin module
  angular
    .module('modelTypes.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Tipos de Artículos',
      state: 'admin.modelTypes.list'
    });
  }
}());
