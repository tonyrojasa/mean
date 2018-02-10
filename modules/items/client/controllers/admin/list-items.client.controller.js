(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminListController', ItemsAdminListController);

  ItemsAdminListController.$inject = ['OpenItemsService', 'ItemsService', 'Authentication', 'NgTableParams', '$location'];

  function ItemsAdminListController(OpenItemsService, ItemsService, Authentication, NgTableParams, $location) {
    var vm = this;
    vm.searchItemStatus = $location.search() && $location.search().status;
    var query;
    if (vm.searchItemStatus) {
      query = {
        status: vm.searchItemStatus
      };
    }

    vm.items = vm.searchItemStatus ? ItemsService.query(query) : OpenItemsService.query(query);

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
