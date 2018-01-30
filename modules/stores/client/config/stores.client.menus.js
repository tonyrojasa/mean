(function () {
  'use strict';

  angular
    .module('stores')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tiendas',
      state: 'stores',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'stores', {
      title: 'Lista de Tiendas',
      state: 'stores.list',
      roles: ['user']
    });
  }
}());
