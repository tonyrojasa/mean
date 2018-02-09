(function () {
  'use strict';

  angular
    .module('items')
    .controller('ItemsListController', ItemsListController);

  ItemsListController.$inject = ['ItemsService'];

  function ItemsListController(ItemsService) {
    var vm = this;

    vm.items = ItemsService.query();

    vm.getResolutionItems = function (status) {
      vm.resolutionItems = ItemsService.query();
    };
  }
}());
