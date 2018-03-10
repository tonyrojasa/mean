(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminController', ItemsAdminController);

  ItemsAdminController.$inject = ['$scope', '$state', '$window', 'itemResolve', 'Authentication', 'Notification',
    'ModelsService', 'ColorsService', 'StoresService', 'WorkshopsService'];

  function ItemsAdminController($scope, $state, $window, item, Authentication, Notification,
    ModelsService, ColorsService, StoresService, WorkshopsService) {
    var vm = this;

    vm.item = item;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.models = ModelsService.query();
    vm.colors = ColorsService.query();
    vm.stores = StoresService.query();
    vm.workshops = WorkshopsService.query();

    vm.item.registrationDate = vm.item.registrationDate ? new Date(vm.item.registrationDate) : new Date();

    if (!vm.item.resolutions || vm.item.resolutions.length === 0) {
      vm.statuses = ['Ingresado'];
    } else {
      vm.statuses = [
        'Cliente - Notificado',
        'Cerrado - Entregado',
        'Cerrado - Desechado'];
    }

    vm.isNotificationPanelAvailable = function (status) {
      return !vm.authentication.isTechnicianUser() && vm.item.resolutions && vm.item.resolutions.length > 0;
    };

    vm.setStatus = function (status) {
      vm.item.status = status;
    };

    vm.isStatusReadOnly = function (status) {
      return !(status === 'Taller - Reparado'
        || status === 'Taller - No se puede reparar'
        || status === 'Taller - No hay repuestos'
        || status.indexOf('Cerrado') === -1
        || status.indexOf('Cliente') === -1);
    };

    vm.isResolutionPanelVisible = function () {
      return (vm.item.resolutions && vm.item.resolutions.length > 0) || vm.item.workshop;
    };

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

    vm.getTotalCost = function () {
      vm.item.revisionCost = vm.item.revisionCost ? vm.item.revisionCost : '';
      vm.item.utilityCost = vm.item.utilityCost ? vm.item.utilityCost : '';
      var resolutionsCost = 0;
      if (vm.item.resolutions) {
        for (var i = 0; i < vm.item.resolutions.length; i++) {
          resolutionsCost += vm.item.resolutions[i].cost ? +vm.item.resolutions[i].cost : 0;
        }
      }
      return +vm.item.revisionCost + +vm.item.utilityCost + resolutionsCost;
    };

    if (!vm.item._id) {
      vm.item.status = 'Ingresado';
      vm.item.registrationDate = new Date();
      vm.item.revisionCost = 5000;
    } else {
      vm.brand = vm.item.model.brand;

      if (vm.item.waranty) {
        vm.item.waranty.expirationDate = vm.item.waranty.expirationDate ? new Date(vm.item.waranty.expirationDate) : '';
      }
    }

    // Remove existing Item
    function remove() {
      if ($window.confirm('Seguro que desea borrar este artículo?')) {
        vm.item.$remove(function () {
          $state.go('admin.items.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i>  Artículo borrado correctamente!!' });
        });
      }
    }

    // Save Item
    function save(isValid, saveDataAndClose) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemForm');
        Notification.error({ message: 'Complete todos los campos requeridos', title: '<i class="glyphicon glyphicon-remove"> Error en el formulario</i>' });
        return false;
      }

      vm.saveDataAndClose = saveDataAndClose;
      vm.item.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        if (!vm.saveDataAndClose) {
          if ($state.current.name === 'admin.items.create') {
            $state.go('admin.items.edit', {
              itemId: res._id
            });
          } else {
            $state.reload();
          }
        } else {
          $state.go('items.view', {
            itemId: res._id
          });
        }
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Artículo guardado correctamente!' });
      }

      function errorCallback(res) {
        var errorMessage = res.data.message === 'SerialNumber already exists' ? 'Este artículo ya existe, verifique el # de serie!' : res.data.message;
        Notification.error({ message: errorMessage, title: '<i class="glyphicon glyphicon-remove"></i> Error al guardar artículo!' });
      }
    }
  }
}());
