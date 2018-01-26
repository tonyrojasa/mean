(function () {
  'use strict';

  angular
    .module('technicians.admin')
    .controller('TechniciansAdminListController', TechniciansAdminListController);

  TechniciansAdminListController.$inject = ['TechniciansService'];

  function TechniciansAdminListController(TechniciansService) {
    var vm = this;

    vm.technicians = TechniciansService.query();
  }
}());
