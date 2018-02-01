(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminController', ItemsAdminController);

  ItemsAdminController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'Authentication', 'Notification',
    'ModelsService', 'ColorsService'];

  function ItemsAdminController($scope, $state, $window, item, Authentication, Notification,
    ModelsService, ColorsService) {
    var vm = this;

    vm.item = item;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.models = ModelsService.query();
    vm.colors = ColorsService.query();

    vm.statuses = [
      'Ingresado',
      'Taller - Enviado',
      'Taller - En reparación',
      'Taller - Reparado',
      'Taller - No reparado',
      'Entregado a dueño',
      'Desechado'];

    vm.setStatus = function (status) {
      vm.item.status = status;
    };

    if (!vm.item._id) {
      vm.item.status = 'Ingresado';
      vm.item.registrationDate = new Date();
    } else {
      vm.brand = vm.item.model.brand;
    }

    // Remove existing Item
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.item.$remove(function () {
          $state.go('admin.items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item deleted successfully!' });
        });
      }
    }

    // Save Item
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        return false;
      }

      // Create a new item, or update the current instance
      vm.item.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.items.list'); // should we send the User to the list or the updated Item's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Item saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Item save error!' });
      }
    }
  }
}());
