(function () {
  'use strict';

  angular
    .module('models')
    .controller('ModelsController', ModelsController);

  ModelsController.$inject = ['$scope', 'modelResolve', 'Authentication'];

  function ModelsController($scope, model, Authentication) {
    var vm = this;

    vm.model = model;
    vm.authentication = Authentication;

  }
}());
