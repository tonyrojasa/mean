(function () {
  'use strict';

  angular
    .module('items.technician.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('technician.items', {
        abstract: true,
        url: '/items',
        template: '<ui-view/>'
      })
      .state('technician.items.list', {
        url: '',
        templateUrl: '/modules/items/client/views/technician/list-items.client.view.html',
        controller: 'ItemsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'technician']
        }
      })
      .state('technician.items.edit', {
        url: '/:itemId/edit',
        templateUrl: '/modules/items/client/views/technician/form-item.client.view.html',
        controller: 'ItemsTechnicianController',
        controllerAs: 'vm',
        data: {
          roles: ['admin', 'technician'],
          pageTitle: '{{ itemResolve.title }}'
        },
        resolve: {
          itemResolve: getItem
        }
      });
  }

  getItem.$inject = ['$stateParams', 'ItemsService'];

  function getItem($stateParams, ItemsService) {
    return ItemsService.get({
      itemId: $stateParams.itemId
    }).$promise;
  }

  newItem.$inject = ['ItemsService'];

  function newItem(ItemsService) {
    return new ItemsService();
  }
}());
