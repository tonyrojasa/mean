(function () {
  'use strict';

  angular
    .module('technicians')
    .controller('TechniciansController', TechniciansController);

  TechniciansController.$inject = ['$scope', 'technicianResolve', 'Authentication'];

  function TechniciansController($scope, technician, Authentication) {
    var vm = this;

    vm.technician = technician;
    vm.authentication = Authentication;

  }
}());
