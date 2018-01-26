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
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'models', {
      title: 'List de Modelos',
      state: 'models.list',
      roles: ['*']
    });
  }
}());
