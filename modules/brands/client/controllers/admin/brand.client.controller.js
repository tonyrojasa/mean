(function () {
  'use strict';

  angular
    .module('brands.admin')
    .controller('BrandsAdminController', BrandsAdminController);

  BrandsAdminController.$inject = ['$scope', '$state', '$window', 'brandResolve', 'Authentication', 'Notification'];

  function BrandsAdminController($scope, $state, $window, brand, Authentication, Notification) {
    var vm = this;

    vm.brand = brand;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Brand
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.brand.$remove(function () {
          $state.go('admin.brands.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Brand deleted successfully!' });
        });
      }
    }

    // Save Brand
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.brandForm');
        return false;
      }

      // Create a new brand, or update the current instance
      vm.brand.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.brands.list'); // should we send the User to the list or the updated Brand's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Brand saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Brand save error!' });
      }
    }
  }
}());
