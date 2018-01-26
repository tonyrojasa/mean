(function () {
  'use strict';

  angular
    .module('stores.admin')
    .controller('StoresAdminController', StoresAdminController);

  StoresAdminController.$inject = ['$scope', '$state', '$window', 'storeResolve', 'Authentication', 'Notification'];

  function StoresAdminController($scope, $state, $window, store, Authentication, Notification) {
    var vm = this;

    vm.store = store;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Store
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.store.$remove(function () {
          $state.go('admin.stores.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Store deleted successfully!' });
        });
      }
    }

    // Save Store
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.storeForm');
        return false;
      }

      // Create a new store, or update the current instance
      vm.store.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.stores.list'); // should we send the User to the list or the updated Store's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Store saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Store save error!' });
      }
    }
  }
}());
