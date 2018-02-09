(function () {
  'use strict';

  angular
    .module('items.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.items', {
        abstract: true,
        url: '/items',
        template: '<ui-view/>'
      })
      .state('admin.items.list', {
        url: '',
        templateUrl: '/modules/items/client/views/admin/list-items.client.view.html',
        controller: 'ItemsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.items.list.close', {
        url: '/?status',
        templateUrl: '/modules/items/client/views/admin/list-items.client.view.html',
        controller: 'ItemsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.items.create', {
        url: '/create',
        templateUrl: '/modules/items/client/views/admin/form-item.client.view.html',
        controller: 'ItemsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          itemResolve: newItem
        }
      })
      .state('admin.items.edit', {
        url: '/:itemId/edit',
        templateUrl: '/modules/items/client/views/admin/form-item.client.view.html',
        controller: 'ItemsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
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
