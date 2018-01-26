(function () {
  'use strict';

  angular
    .module('stores.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('stores', {
        abstract: true,
        url: '/stores',
        template: '<ui-view/>'
      })
      .state('stores.list', {
        url: '',
        templateUrl: '/modules/stores/client/views/list-stores.client.view.html',
        controller: 'StoresListController',
        controllerAs: 'vm'
      })
      .state('stores.view', {
        url: '/:storeId',
        templateUrl: '/modules/stores/client/views/view-store.client.view.html',
        controller: 'StoresController',
        controllerAs: 'vm',
        resolve: {
          storeResolve: getStore
        },
        data: {
          pageTitle: '{{ storeResolve.title }}'
        }
      });
  }

  getStore.$inject = ['$stateParams', 'StoresService'];

  function getStore($stateParams, StoresService) {
    return StoresService.get({
      storeId: $stateParams.storeId
    }).$promise;
  }
}());
