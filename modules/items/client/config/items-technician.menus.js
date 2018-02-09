(function () {
  'use strict';

  // Configuring the Items Technician module
  angular
    .module('items.technician')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'technician', {
      title: 'Admimnistrar Resoluciones',
      state: 'technician.items.list'
    });
  }
}());
