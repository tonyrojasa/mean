(function () {
  'use strict';

  angular
    .module('modelTypes.admin')
    .controller('ModelTypesAdminController', ModelTypesAdminController);

  ModelTypesAdminController.$inject = ['$scope', '$state', '$window', 'modelTypeResolve', 'Authentication', 'Notification'];

  function ModelTypesAdminController($scope, $state, $window, modelType, Authentication, Notification) {
    var vm = this;

    vm.modelType = modelType;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing ModelType
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.modelType.$remove(function () {
          $state.go('admin.modelTypes.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ModelType deleted successfully!' });
        });
      }
    }

    // Save ModelType
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.modelTypeForm');
        return false;
      }

      // Create a new modelType, or update the current instance
      vm.modelType.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.modelTypes.list'); // should we send the User to the list or the updated ModelType's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> ModelType saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> ModelType save error!' });
      }
    }
  }
}());
