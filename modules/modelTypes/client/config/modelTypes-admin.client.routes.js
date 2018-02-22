(function () {
  'use strict';

  angular
    .module('modelTypes.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.modelTypes', {
        abstract: true,
        url: '/modelTypes',
        template: '<ui-view/>'
      })
      .state('admin.modelTypes.list', {
        url: '',
        templateUrl: '/modules/modelTypes/client/views/admin/list-modelTypes.client.view.html',
        controller: 'ModelTypesAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.modelTypes.create', {
        url: '/create',
        templateUrl: '/modules/modelTypes/client/views/admin/form-modelType.client.view.html',
        controller: 'ModelTypesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          modelTypeResolve: newModelType
        }
      })
      .state('admin.modelTypes.edit', {
        url: '/:modelTypeId/edit',
        templateUrl: '/modules/modelTypes/client/views/admin/form-modelType.client.view.html',
        controller: 'ModelTypesAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ modelTypeResolve.title }}'
        },
        resolve: {
          modelTypeResolve: getModelType
        }
      });
  }

  getModelType.$inject = ['$stateParams', 'ModelTypesService'];

  function getModelType($stateParams, ModelTypesService) {
    return ModelTypesService.get({
      modelTypeId: $stateParams.modelTypeId
    }).$promise;
  }

  newModelType.$inject = ['ModelTypesService'];

  function newModelType(ModelTypesService) {
    return new ModelTypesService();
  }
}());
