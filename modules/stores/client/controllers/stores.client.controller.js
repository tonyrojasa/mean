(function () {
  'use strict';

  angular
    .module('stores')
    .controller('StoresController', StoresController);

  StoresController.$inject = ['$scope', 'storeResolve', 'Authentication'];

  function StoresController($scope, store, Authentication) {
    var vm = this;

    vm.store = store;
    vm.authentication = Authentication;

  }
}());
