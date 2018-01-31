(function () {
  'use strict';

  angular
    .module('workshops')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Talleres',
      state: 'workshops',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'workshops', {
      title: 'Lista de Talleres',
      state: 'workshops.list',
      roles: ['user']
    });
  }
}());
