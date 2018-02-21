(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', 'itemResolve', 'Authentication'];

  function ItemsController($scope, item, Authentication) {
    var vm = this;

    vm.item = item;
    vm.authentication = Authentication;

    vm.getItemResolutionsTotal = function () {
      var resolutionsCost = 0;
      if (vm.item.resolutions) {
        for (var i = 0; i < vm.item.resolutions.length; i++) {
          resolutionsCost += vm.item.resolutions[i].cost ? +vm.item.resolutions[i].cost : 0;
        }
      }
      return resolutionsCost;
    };

    vm.getTotalCost = function () {
      vm.item.revisionCost = vm.item.revisionCost ? vm.item.revisionCost : '';
      return +vm.item.revisionCost + vm.getItemResolutionsTotal();
    };

  }
}());
