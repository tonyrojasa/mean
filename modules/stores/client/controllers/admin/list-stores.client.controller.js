(function () {
  'use strict';

  angular
    .module('stores.admin')
    .controller('StoresAdminListController', StoresAdminListController);

  StoresAdminListController.$inject = ['StoresService'];

  function StoresAdminListController(StoresService) {
    var vm = this;

    vm.stores = StoresService.query();
  }
}());
