(function () {
  'use strict';

  // Configuring the Brands Admin module
  angular
    .module('brands.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Marcas',
      state: 'admin.brands.list'
    });
  }
}());
