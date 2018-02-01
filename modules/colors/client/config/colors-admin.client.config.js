(function () {
  'use strict';

  // Configuring the Colors Admin module
  angular
    .module('colors.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Colores',
      state: 'admin.colors.list'
    });
  }
}());
