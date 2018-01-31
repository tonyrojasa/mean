(function () {
  'use strict';

  angular
    .module('workshops.admin')
    .controller('WorkshopsAdminListController', WorkshopsAdminListController);

  WorkshopsAdminListController.$inject = ['WorkshopsService'];

  function WorkshopsAdminListController(WorkshopsService) {
    var vm = this;

    vm.workshops = WorkshopsService.query();
  }
}());
