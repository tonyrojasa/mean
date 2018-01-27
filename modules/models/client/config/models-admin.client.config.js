(function () {
  'use strict';

  // Configuring the Models Admin module
  angular
    .module('models.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Administrar Modelos',
      state: 'admin.models.list'
    });
  }
}());
