(function () {
  'use strict';

  angular
    .module('core.technician.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('technician', {
        abstract: true,
        url: '/technician',
        template: '<ui-view/>',
        data: {
          roles: ['admin', 'technician']
        }
      });
  }
}());
