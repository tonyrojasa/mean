(function () {
  'use strict';

  angular
    .module('colors.admin')
    .controller('ColorsAdminListController', ColorsAdminListController);

  ColorsAdminListController.$inject = ['ColorsService'];

  function ColorsAdminListController(ColorsService) {
    var vm = this;

    vm.colors = ColorsService.query();
  }
}());
