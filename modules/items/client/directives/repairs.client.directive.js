(function () {
  'use strict';

  angular
    .module('items.admin')
    .directive('repairs', repairs);

  repairs.$inject = ['TechniciansService', 'Notification'];

  function repairs(TechniciansService, Notification) {
    return {
      templateUrl: '/modules/items/client/views/admin/repairs.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        resolutions: '=',
        status: '=',
        form: '=',
        readonly: '@',
        onStatusChange: '=',
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

        scope.addResolution = function (form) {
          if (!scope.form.$valid) {
            debugger;
            scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
            Notification.error({ message: 'Complete todos los campos requeridos', title: '<i class="glyphicon glyphicon-remove"> Error en el formulario</i>' });
            return false;
          }
          if (!scope.resolutions) {
            scope.resolutions = [];
          }

          _.each(scope.resolutions, function (resolution) {
            resolution.open = false;
          });

          scope.resolutions.push({
            resolutionDate: '',
            condition: scope.status,
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
          if (condition)
            scope.onStatusChange(condition);
        };

        scope.removeResolution = function (index) {
          if (confirm('Seguro que desea eliminar la resolución #' + (index + 1) + '? Perdera todos los cambios')) {
            scope.resolutions.splice(index, 1);
            scope.onStatusChange();
          }
        };

      }
    };
  }
}());
