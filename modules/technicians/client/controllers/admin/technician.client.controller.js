(function () {
  'use strict';

  angular
    .module('technicians.admin')
    .controller('TechniciansAdminController', TechniciansAdminController);

  TechniciansAdminController.$inject = ['$scope', '$state', '$window', 'technicianResolve',
    'Authentication', 'Notification', 'WorkshopsService'];

  function TechniciansAdminController($scope, $state, $window, technician,
    Authentication, Notification, WorkshopsService) {
    var vm = this;

    vm.technician = technician;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.workshops = WorkshopsService.query();

    // Remove existing Technician
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.technician.$remove(function () {
          $state.go('admin.technicians.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Technician deleted successfully!' });
        });
      }
    }

    // Save Technician
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.technicianForm');
        return false;
      }

      // Create a new technician, or update the current instance
      vm.technician.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.technicians.list'); // should we send the User to the list or the updated Technician's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Technician saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Technician save error!' });
      }
    }
  }
}());
