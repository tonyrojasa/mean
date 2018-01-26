(function () {
  'use strict';

  angular
    .module('technicians.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.technicians', {
        abstract: true,
        url: '/technicians',
        template: '<ui-view/>'
      })
      .state('admin.technicians.list', {
        url: '',
        templateUrl: '/modules/technicians/client/views/admin/list-technicians.client.view.html',
        controller: 'TechniciansAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.technicians.create', {
        url: '/create',
        templateUrl: '/modules/technicians/client/views/admin/form-technician.client.view.html',
        controller: 'TechniciansAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          technicianResolve: newTechnician
        }
      })
      .state('admin.technicians.edit', {
        url: '/:technicianId/edit',
        templateUrl: '/modules/technicians/client/views/admin/form-technician.client.view.html',
        controller: 'TechniciansAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ technicianResolve.title }}'
        },
        resolve: {
          technicianResolve: getTechnician
        }
      });
  }

  getTechnician.$inject = ['$stateParams', 'TechniciansService'];

  function getTechnician($stateParams, TechniciansService) {
    return TechniciansService.get({
      technicianId: $stateParams.technicianId
    }).$promise;
  }

  newTechnician.$inject = ['TechniciansService'];

  function newTechnician(TechniciansService) {
    return new TechniciansService();
  }
}());
