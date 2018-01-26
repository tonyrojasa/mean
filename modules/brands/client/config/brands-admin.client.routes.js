(function () {
  'use strict';

  angular
    .module('brands.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.brands', {
        abstract: true,
        url: '/brands',
        template: '<ui-view/>'
      })
      .state('admin.brands.list', {
        url: '',
        templateUrl: '/modules/brands/client/views/admin/list-brands.client.view.html',
        controller: 'BrandsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.brands.create', {
        url: '/create',
        templateUrl: '/modules/brands/client/views/admin/form-brand.client.view.html',
        controller: 'BrandsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          brandResolve: newBrand
        }
      })
      .state('admin.brands.edit', {
        url: '/:brandId/edit',
        templateUrl: '/modules/brands/client/views/admin/form-brand.client.view.html',
        controller: 'BrandsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ brandResolve.title }}'
        },
        resolve: {
          brandResolve: getBrand
        }
      });
  }

  getBrand.$inject = ['$stateParams', 'BrandsService'];

  function getBrand($stateParams, BrandsService) {
    return BrandsService.get({
      brandId: $stateParams.brandId
    }).$promise;
  }

  newBrand.$inject = ['BrandsService'];

  function newBrand(BrandsService) {
    return new BrandsService();
  }
}());
