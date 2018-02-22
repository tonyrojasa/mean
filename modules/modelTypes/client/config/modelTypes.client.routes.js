(function () {
  'use strict';

  angular
    .module('modelTypes.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('modelTypes', {
        abstract: true,
        url: '/modelTypes',
        template: '<ui-view/>'
      })
      .state('modelTypes.list', {
        url: '',
        templateUrl: '/modules/modelTypes/client/views/list-modelTypes.client.view.html',
        controller: 'ModelTypesListController',
        controllerAs: 'vm'
      })
      .state('modelTypes.view', {
        url: '/:modelTypeId',
        templateUrl: '/modules/modelTypes/client/views/view-modelType.client.view.html',
        controller: 'ModelTypesController',
        controllerAs: 'vm',
        resolve: {
          modelTypeResolve: getModelType
        },
        data: {
          pageTitle: '{{ modelTypeResolve.title }}'
        }
      });
  }

  getModelType.$inject = ['$stateParams', 'ModelTypesService'];

  function getModelType($stateParams, ModelTypesService) {
    return ModelTypesService.get({
      modelTypeId: $stateParams.modelTypeId
    }).$promise;
  }
}());
