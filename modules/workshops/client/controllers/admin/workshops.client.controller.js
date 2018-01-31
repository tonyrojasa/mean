(function () {
  'use strict';

  angular
    .module('workshops.admin')
    .controller('WorkshopsAdminController', WorkshopsAdminController);

  WorkshopsAdminController.$inject = ['$scope', '$state', '$window', 'workshopResolve', 'Authentication', 'Notification'];

  function WorkshopsAdminController($scope, $state, $window, workshop, Authentication, Notification) {
    var vm = this;

    vm.workshop = workshop;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.locations = ['Alajuela', 'Cartago', 'Guanacaste', 'Heredia', 'Limón', 'Puntarenas', 'San José'];

    vm.setLocation = function (location) {
      vm.workshop.location = location;
    };

    // Remove existing Workshop
    function remove() {
      if ($window.confirm('Esta seguro que desea eliminar esta taller?')) {
        vm.workshop.$remove(function () {
          $state.go('admin.workshops.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Workshop deleted successfully!' });
        });
      }
    }

    // Save Workshop
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.workshopForm');
        return false;
      }

      // Create a new workshop, or update the current instance
      vm.workshop.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.workshops.list'); // should we send the User to the list or the updated Workshop's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Taller guardada exitosamente!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Workshop save error!' });
      }
    }
  }
}());
