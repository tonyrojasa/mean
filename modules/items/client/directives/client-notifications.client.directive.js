(function () {
  'use strict';

  angular
    .module('items.admin')
    .directive('clientNotifications', clientNotifications);

  clientNotifications.$inject = ['Notification'];

  function clientNotifications(Notification) {
    return {
      templateUrl: '/modules/items/client/views/admin/client-notifications.client.view.html',
      restrict: 'E',
      replace: true,
      scope: {
        notifications: '=',
        status: '=',
        form: '=',
        readonly: '@',
        onStatusChange: '=',
        showLabels: '='
      },
      link: function postLink(scope, element, attrs) {

        if (scope.notifications && scope.notifications.length) {
          _.each(scope.notifications, function (notification, index) {
            notification.date = notification.date ? new Date(notification.date) : new Date();
          });
        }

        scope.addNotification = function (form) {
          if (!scope.form.$valid) {
            debugger;
            scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
            Notification.error({ message: 'Complete todos los campos requeridos', title: '<i class="glyphicon glyphicon-remove"> Error en el formulario</i>' });
            return false;
          }
          if (!scope.notifications) {
            scope.notifications = [];
          }

          _.each(scope.notifications, function (notification) {
            notification.open = false;
          });

          scope.notifications.push({
            date: new Date(),
            type: '',
            observations: '',
            cost: '',
            status: '',
            notifier: '',
            open: true
          });
        };
        scope.types = [
          'Llamada',
          'Mensaje',
          'Correo',
          'Otro'
        ];
        scope.statuses = [
          'Cliente - Notificado',
          'Cliente - No se puede contactar'
        ];

        scope.onSelectType = function (status, index) {
          if (status) {
            scope.onStatusChange(status);
          }
        };

        scope.removeNotification = function (index) {
          if (confirm('Seguro que desea eliminar la notificación #' + (index + 1) + '? Perdera todos los cambios')) {
            scope.notifications.splice(index, 1);
            scope.onStatusChange();
          }
        };

      }
    };
  }
}());
