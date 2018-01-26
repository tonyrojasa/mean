(function () {
  'use strict';

  angular
    .module('models.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.models', {
        abstract: true,
        url: '/models',
        template: '<ui-view/>'
      })
      .state('admin.models.list', {
        url: '',
        templateUrl: '/modules/models/client/views/admin/list-models.client.view.html',
        controller: 'ModelsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.models.create', {
        url: '/create',
        templateUrl: '/modules/models/client/views/admin/form-model.client.view.html',
        controller: 'ModelsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          modelResolve: newModel
        }
      })
      .state('admin.models.edit', {
        url: '/:modelId/edit',
        templateUrl: '/modules/models/client/views/admin/form-model.client.view.html',
        controller: 'ModelsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ modelResolve.title }}'
        },
        resolve: {
          modelResolve: getModel
        }
      });
  }

  getModel.$inject = ['$stateParams', 'ModelsService'];

  function getModel($stateParams, ModelsService) {
    return ModelsService.get({
      modelId: $stateParams.modelId
    }).$promise;
  }

  newModel.$inject = ['ModelsService'];

  function newModel(ModelsService) {
    return new ModelsService();
  }
}());
