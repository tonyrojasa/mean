(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminListController', ItemsAdminListController);

  ItemsAdminListController.$inject = ['OpenItemsService', 'ItemsService', 'Authentication', 'NgTableParams', '$location',
    'StoresService', 'ColorsService'];

  function ItemsAdminListController(OpenItemsService, ItemsService, Authentication, NgTableParams, $location,
    StoresService, ColorsService) {
    var vm = this;
    vm.searchItemStatus = $location.search() && $location.search().status;
    var query;
    if (vm.searchItemStatus) {
      query = {
        status: vm.searchItemStatus
      };
    }

    vm.items = vm.searchItemStatus ? ItemsService.query(query) : OpenItemsService.query(query);

    vm.queryAndBuildFilterArray = function (service, array) {
      var collection = service.query(function (data) {
        _.each(data, function (item) {
          array.push({
            id: item.name,
            title: item.name
          });
        });
      });
      return collection;
    };

    vm.storesFilterArray = [];
    vm.stores = vm.queryAndBuildFilterArray(StoresService, vm.storesFilterArray);
    vm.colorsFilterArray = [];
    vm.colors = vm.queryAndBuildFilterArray(ColorsService, vm.colorsFilterArray);

    vm.statusesFilterArray = [
      { id: 'Ingresado', title: 'Ingresado' },
      { id: 'Taller - Enviado', title: 'Taller - Enviado' },
      { id: 'Taller - En reparación', title: 'Taller - En reparación' },
      { id: 'Taller - Reparado', title: 'Taller - Reparado' },
      { id: 'Taller - No reparado', title: 'Taller - No reparado' },
      { id: 'Entregado a dueño', title: 'Entregado a dueño' },
      { id: 'Desechado', title: 'Desechado' }];

    vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { dataset: vm.items });

    vm.getItemTotalCost = function (item) {
      item.revisionCost = item.revisionCost ? item.revisionCost : '';
      var resolutionsCost = 0;
      if (item.resolutions) {
        for (var i = 0; i < item.resolutions.length; i++) {
          resolutionsCost += item.resolutions[i].cost ? +item.resolutions[i].cost : 0;
        }
      }
      return +item.revisionCost + resolutionsCost;
    };

    vm.getItemLatResolutionDate = function (item) {
      var itemLatResolutionDate = '';
      if (item.resolutions.length > 0) {
        itemLatResolutionDate = item.resolutions[item.resolutions.length - 1].creationDate;
      }
      return itemLatResolutionDate;
    };
  }
}());
