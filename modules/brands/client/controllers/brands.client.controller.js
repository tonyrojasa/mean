(function () {
  'use strict';

  angular
    .module('brands')
    .controller('BrandsController', BrandsController);

  BrandsController.$inject = ['$scope', 'brandResolve', 'Authentication'];

  function BrandsController($scope, brand, Authentication) {
    var vm = this;

    vm.brand = brand;
    vm.authentication = Authentication;

  }
}());
