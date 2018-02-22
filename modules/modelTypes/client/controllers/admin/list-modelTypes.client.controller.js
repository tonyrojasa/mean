(function () {
  'use strict';

  angular
    .module('modelTypes.admin')
    .controller('ModelTypesAdminListController', ModelTypesAdminListController);

  ModelTypesAdminListController.$inject = ['ModelTypesService'];

  function ModelTypesAdminListController(ModelTypesService) {
    var vm = this;

    vm.modelTypes = ModelTypesService.query();
  }
}());
