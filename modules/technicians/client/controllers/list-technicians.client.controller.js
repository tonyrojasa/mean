(function () {
  'use strict';

  angular
    .module('technicians')
    .controller('TechniciansListController', TechniciansListController);

  TechniciansListController.$inject = ['TechniciansService'];

  function TechniciansListController(TechniciansService) {
    var vm = this;

    vm.technicians = TechniciansService.query();
  }
}());
