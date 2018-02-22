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

    vm.getStatusClass = function (status) {
      switch (status) {
        case 'Ingresado':
          return 'bg-active';
          break;
        case 'Taller - Reparado':
          return 'bg-success';
          break;
        case 'Taller - No se puede reparar':
          return 'bg-danger';
          break;
        case 'Taller - No hay repuestos':
          return 'bg-danger';
          break;
        case 'Pendiente de repuestos':
          return 'bg-warning';
          break;
        case 'Cliente - Notificado':
          return 'bg-info';
          break;
        case 'Cerrado - Entregado':
          return 'bg-info';
          break;
        case 'Cerrado - Desechado':
          return 'bg-danger';
          break;
      }
    };

  }
}());
