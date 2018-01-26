(function () {
  'use strict';

  angular
    .module('technicians')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Técnicos',
      state: 'technicians',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'technicians', {
      title: 'Lista de Técnicos',
      state: 'technicians.list',
      roles: ['*']
    });
  }
}());
