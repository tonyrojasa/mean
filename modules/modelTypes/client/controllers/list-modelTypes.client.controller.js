(function () {
  'use strict';

  angular
    .module('modelTypes')
    .controller('ModelTypesListController', ModelTypesListController);

  ModelTypesListController.$inject = ['ModelTypesService'];

  function ModelTypesListController(ModelTypesService) {
    var vm = this;

    vm.modelTypes = ModelTypesService.query();
  }
}());
