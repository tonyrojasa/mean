(function () {
  'use strict';

  // Configuring the Technicians Admin module
  angular
    .module('technicians.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Technicians',
      state: 'admin.technicians.list'
    });
  }
}());
