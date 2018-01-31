(function () {
  'use strict';

  angular
    .module('workshops')
    .controller('WorkshopsController', WorkshopsController);

  WorkshopsController.$inject = ['$scope', 'workshopResolve', 'Authentication'];

  function WorkshopsController($scope, workshop, Authentication) {
    var vm = this;

    vm.workshop = workshop;
    vm.authentication = Authentication;

  }
}());
