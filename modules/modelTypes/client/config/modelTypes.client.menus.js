(function () {
  'use strict';

  angular
    .module('modelTypes')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tipos de Artículos',
      state: 'modelTypes',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'modelTypes', {
      title: 'Lista de Tipos de Artículos',
      state: 'modelTypes.list',
      roles: ['user']
    });
  }
}());
