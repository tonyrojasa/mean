(function () {
  'use strict';

  angular
    .module('brands')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Marcas',
      state: 'brands',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'brands', {
      title: 'Lista de Marcas',
      state: 'brands.list',
      roles: ['user']
    });
  }
}());
