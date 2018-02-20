(function () {
  'use strict';

  angular
    .module('items.admin')
    .directive('repairs', repairs);

  repairs.$inject = ['TechniciansService'];

  function repairs(TechniciansService) {
    return {
      templateUrl: '/modules/items/client/views/admin/repairs.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        resolutions: '=',
        status: '=',
        form: '=',
        readonly: '@',
        showLabels: '=',
        isTechnician: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.technicians = TechniciansService.query();
        if (scope.resolutions && scope.resolutions.length) {
          _.each(scope.resolutions, function (resolution, index) {
            resolution.date = resolution.date ? new Date(resolution.date) : new Date();
            resolution.creationDate = resolution.creationDate ? new Date(resolution.creationDate) : new Date();
          });
        }

        scope.addResolution = function () {
          if (!scope.resolutions) {
            scope.resolutions = [];
          }

          _.each(scope.resolutions, function (resolution) {
            resolution.open = false;
          });

          scope.resolutions.push({
            resolutionDate: '',
            condition: '',
            observations: '',
            cost: '',
            technician: '',
            creationDate: new Date(),
            date: scope.isTechnician ? new Date() : '',
            open: true
          });
        };
        scope.conditions = [
          'Taller - En reparación',
          'Taller - Reparado',
          'Taller - No se puede reparar',
          'Taller - Pendiente de repuestos',
          'Taller - No hay repuestos'
        ];

        scope.onSelectCondition = function (condition, index) {
          if (index === scope.resolutions.length - 1 && condition)
            scope.status = condition;
        };

        scope.removeResolution = function (index) {
          if (confirm('Seguro que desea eliminar la resolución #' + (index + 1) + '? Perdera todos los cambios')) {
            scope.resolutions.splice(index, 1);
          }
        };

      }
    };
  }
}());
