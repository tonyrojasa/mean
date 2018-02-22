(function () {
  'use strict';

  angular
    .module('modelTypes')
    .controller('ModelTypesController', ModelTypesController);

  ModelTypesController.$inject = ['$scope', 'modelTypeResolve', 'Authentication'];

  function ModelTypesController($scope, modelType, Authentication) {
    var vm = this;

    vm.modelType = modelType;
    vm.authentication = Authentication;

  }
}());
