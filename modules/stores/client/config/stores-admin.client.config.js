(function () {
  'use strict';

  // Configuring the Stores Admin module
  angular
    .module('stores.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Tiendas',
      state: 'admin.stores.list'
    });
  }
}());
