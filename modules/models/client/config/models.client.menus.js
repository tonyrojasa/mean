(function () {
  'use strict';

  angular
    .module('models')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Modelos',
      state: 'models',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'models', {
      title: 'Lista de Modelos',
      state: 'models.list',
      roles: ['user']
    });
  }
}());
