(function () {
  'use strict';

  angular
    .module('core.technician')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Resoluciones',
      state: 'technician',
      type: 'dropdown',
      roles: ['technician']
    });
  }
}());
