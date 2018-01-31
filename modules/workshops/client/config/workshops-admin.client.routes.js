(function () {
  'use strict';

  angular
    .module('workshops.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.workshops', {
        abstract: true,
        url: '/workshops',
        template: '<ui-view/>'
      })
      .state('admin.workshops.list', {
        url: '',
        templateUrl: '/modules/workshops/client/views/admin/list-workshops.client.view.html',
        controller: 'WorkshopsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.workshops.create', {
        url: '/create',
        templateUrl: '/modules/workshops/client/views/admin/form-workshop.client.view.html',
        controller: 'WorkshopsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          workshopResolve: newWorkshop
        }
      })
      .state('admin.workshops.edit', {
        url: '/:workshopId/edit',
        templateUrl: '/modules/workshops/client/views/admin/form-workshop.client.view.html',
        controller: 'WorkshopsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ workshopResolve.title }}'
        },
        resolve: {
          workshopResolve: getWorkshop
        }
      });
  }

  getWorkshop.$inject = ['$stateParams', 'WorkshopsService'];

  function getWorkshop($stateParams, WorkshopsService) {
    return WorkshopsService.get({
      workshopId: $stateParams.workshopId
    }).$promise;
  }

  newWorkshop.$inject = ['WorkshopsService'];

  function newWorkshop(WorkshopsService) {
    return new WorkshopsService();
  }
}());
