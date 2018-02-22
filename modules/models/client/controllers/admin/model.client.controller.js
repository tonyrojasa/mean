(function () {
  'use strict';

  angular
    .module('models.admin')
    .controller('ModelsAdminController', ModelsAdminController);

  ModelsAdminController.$inject = ['$scope', '$state', '$window', 'modelResolve', 'Authentication', 'Notification',
    'BrandsService', 'ModelTypesService'];

  function ModelsAdminController($scope, $state, $window, model, Authentication, Notification,
    BrandsService, ModelTypesService) {
    var vm = this;

    vm.model = model;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.brands = BrandsService.query();
    vm.modelTypes = ModelTypesService.query();

    // Remove existing Model
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.model.$remove(function () {
          $state.go('admin.models.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Model deleted successfully!' });
        });
      }
    }

    // Save Model
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.modelForm');
        return false;
      }

      // Create a new model, or update the current instance
      vm.model.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.models.list'); // should we send the User to the list or the updated Model's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Model saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Model save error!' });
      }
    }
  }
}());
