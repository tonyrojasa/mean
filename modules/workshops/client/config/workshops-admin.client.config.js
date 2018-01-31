(function () {
  'use strict';

  // Configuring the Workshops Admin module
  angular
    .module('workshops.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Talleres',
      state: 'admin.workshops.list'
    });
  }
}());
