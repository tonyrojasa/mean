(function () {
  'use strict';

  angular
    .module('models.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('models', {
        abstract: true,
        url: '/models',
        template: '<ui-view/>'
      })
      .state('models.list', {
        url: '',
        templateUrl: '/modules/models/client/views/list-models.client.view.html',
        controller: 'ModelsListController',
        controllerAs: 'vm'
      })
      .state('models.view', {
        url: '/:modelId',
        templateUrl: '/modules/models/client/views/view-model.client.view.html',
        controller: 'ModelsController',
        controllerAs: 'vm',
        resolve: {
          modelResolve: getModel
        },
        data: {
          pageTitle: '{{ modelResolve.title }}'
        }
      });
  }

  getModel.$inject = ['$stateParams', 'ModelsService'];

  function getModel($stateParams, ModelsService) {
    return ModelsService.get({
      modelId: $stateParams.modelId
    }).$promise;
  }
}());
