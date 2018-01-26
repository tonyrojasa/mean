(function () {
  'use strict';

  angular
    .module('brands.admin')
    .controller('BrandsAdminListController', BrandsAdminListController);

  BrandsAdminListController.$inject = ['BrandsService'];

  function BrandsAdminListController(BrandsService) {
    var vm = this;

    vm.brands = BrandsService.query();
  }
}());
