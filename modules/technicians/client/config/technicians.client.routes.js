(function () {
  'use strict';

  angular
    .module('technicians.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('technicians', {
        abstract: true,
        url: '/technicians',
        template: '<ui-view/>'
      })
      .state('technicians.list', {
        url: '',
        templateUrl: '/modules/technicians/client/views/list-technicians.client.view.html',
        controller: 'TechniciansListController',
        controllerAs: 'vm'
      })
      .state('technicians.view', {
        url: '/:technicianId',
        templateUrl: '/modules/technicians/client/views/view-technician.client.view.html',
        controller: 'TechniciansController',
        controllerAs: 'vm',
        resolve: {
          technicianResolve: getTechnician
        },
        data: {
          pageTitle: '{{ technicianResolve.title }}'
        }
      });
  }

  getTechnician.$inject = ['$stateParams', 'TechniciansService'];

  function getTechnician($stateParams, TechniciansService) {
    return TechniciansService.get({
      technicianId: $stateParams.technicianId
    }).$promise;
  }
}());
