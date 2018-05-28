(function () {
  'use strict';

  angular
    .module('items.technician')
    .controller('ItemsTechnicianController', ItemsTechnicianController);

  ItemsTechnicianController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'Authentication', 'Notification',
    'ModelsService', 'ColorsService'];

  function ItemsTechnicianController($scope, $state, $window, item, Authentication, Notification,
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

    vm.getTotalCost = function () {
      vm.item.cost = vm.item.cost ? vm.item.cost : '';
      var resolutionsCost = 0;
      if (vm.item.resolutions) {
        for (var i = 0; i < vm.item.resolutions.length; i++) {
          resolutionsCost += vm.item.resolutions[i].cost ? +vm.item.resolutions[i].cost : 0;
        }
      }
      return +resolutionsCost;
    };

    if (!vm.item._id) {
      vm.item.status = 'Ingresado';
      vm.item.registrationDate = new Date();
      vm.item.cost = 5000;
    } else {
      vm.brand = vm.item.model.brand;
    }

    vm.onStatusChange = function (status) {
      if (status) {
        vm.item.status = status;
      } else {
        if (vm.item.notifications && vm.item.notifications.length > 0) {
          vm.item.status = vm.item.notifications[vm.item.notifications.length - 1].status;
        } else if (vm.item.resolutions && vm.item.resolutions.length > 0) {
          vm.item.status = vm.item.resolutions[vm.item.resolutions.length - 1].condition;

        } else {
          vm.item.status = 'Ingresado';
        }
      }
    };

    // Remove existing Item
    function remove() {
      if ($window.confirm('Seguro que desea borrar este artículo?')) {
        vm.item.$remove(function () {
          $state.go('admin.items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Artículo borrado correctamente!' });
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
        $state.go('technician.items.list'); // should we send the User to the list or the updated Item's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Artículo guardado correctamente!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al guardar artículo!' });
      }
    }
  }
}());
