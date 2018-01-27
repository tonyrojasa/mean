(function () {
  'use strict';

  // Configuring the Items Admin module
  angular
    .module('items.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Admimnistrar Artículos',
      state: 'admin.items.list'
    });
  }
}());
