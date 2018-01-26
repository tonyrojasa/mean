(function () {
  'use strict';

  angular
    .module('brands.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('brands', {
        abstract: true,
        url: '/brands',
        template: '<ui-view/>'
      })
      .state('brands.list', {
        url: '',
        templateUrl: '/modules/brands/client/views/list-brands.client.view.html',
        controller: 'BrandsListController',
        controllerAs: 'vm'
      })
      .state('brands.view', {
        url: '/:brandId',
        templateUrl: '/modules/brands/client/views/view-brand.client.view.html',
        controller: 'BrandsController',
        controllerAs: 'vm',
        resolve: {
          brandResolve: getBrand
        },
        data: {
          pageTitle: '{{ brandResolve.title }}'
        }
      });
  }

  getBrand.$inject = ['$stateParams', 'BrandsService'];

  function getBrand($stateParams, BrandsService) {
    return BrandsService.get({
      brandId: $stateParams.brandId
    }).$promise;
  }
}());
