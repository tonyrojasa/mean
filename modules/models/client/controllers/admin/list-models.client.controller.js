(function () {
  'use strict';

  angular
    .module('models.admin')
    .controller('ModelsAdminListController', ModelsAdminListController);

  ModelsAdminListController.$inject = ['ModelsService'];

  function ModelsAdminListController(ModelsService) {
    var vm = this;

    vm.models = ModelsService.query();
  }
}());
