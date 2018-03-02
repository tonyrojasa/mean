(function () {
  'use strict';

  // Configuring the Items Admin module
  angular
    .module('items.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Artículos',
      state: 'items',
      type: 'dropdown',
      roles: ['admin', 'user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'items', {
      title: 'Lista Artículos - Casos Abiertos',
      state: 'admin.items.list',
      roles: ['admin', 'user']
    });
    menuService.addSubMenuItem('topbar', 'items', {
      title: 'Lista Artículos - Casos Cerrados',
      state: 'admin.items.close',
      roles: ['admin', 'user']
    });
  }
}());
