(function () {
  'use strict';

  angular
    .module('items.admin')
    .controller('ItemsAdminListController', ItemsAdminListController);

  ItemsAdminListController.$inject = ['itemsServiceResolve', 'Authentication', 'NgTableParams',
    'StoresService', 'ColorsService', 'Notification', '$state'];

  function ItemsAdminListController(itemsService, Authentication, NgTableParams,
    StoresService, ColorsService, Notification, $state) {
    var vm = this;
    vm.authentication = Authentication;
    vm.itemsService = itemsService;
    vm.items = vm.itemsService.query();
    vm.isCloseItemsList = $state.current.name === 'admin.items.close';

    vm.queryAndBuildFilterArray = function (service, array) {
      var collection = service.query(function (data) {
        _.each(data, function (item) {
          array.push({
            id: item.name,
            title: item.name
          });
        });
      });
      return collection;
    };

    vm.storesFilterArray = [];
    vm.stores = vm.queryAndBuildFilterArray(StoresService, vm.storesFilterArray);
    vm.colorsFilterArray = [];
    vm.colors = vm.queryAndBuildFilterArray(ColorsService, vm.colorsFilterArray);

    vm.statusesFilterArray = [
      { id: 'Ingresado', title: 'Ingresado' },
      { id: 'Taller - En reparación', title: 'Taller - En reparación' },
      { id: 'Taller - Reparado', title: 'Taller - Reparado' },
      { id: 'Taller - No se puede reparar', title: 'Taller - No se puede reparar' },
      { id: 'Taller - No hay repuestos', title: 'Taller - No hay repuestos' },
      { id: 'Taller - Pendiente de repuestos', title: 'Taller - No hay repuestos' },
      { id: 'Cliente - Notificado', title: 'Cliente - Notificado' },
      { id: 'Cliente - No se puede contactar', title: 'Cliente - No se puede contactar' },
      { id: 'Cerrado - Entregado', title: 'Cerrado - Entregado' },
      { id: 'Cerrado - Desechado', title: 'Cerrado - Desechado' }];

    vm.isStatusClosable = function (status) {
      return (status === 'Taller - Reparado'
        || status === 'Taller - No se puede reparar'
        || status === 'Taller - No hay repuestos'
        || status.indexOf('Cliente') > -1)
        || (vm.isCloseItemsList && vm.authentication.isAdminUser())
    };

    vm.tableParams = new NgTableParams({ page: 1, count: 10 }, { dataset: vm.items });

    vm.getItemTotalCost = function (item) {
      item.revisionCost = item.revisionCost ? item.revisionCost : '';
      var resolutionsCost = 0;
      if (item.resolutions) {
        for (var i = 0; i < item.resolutions.length; i++) {
          resolutionsCost += item.resolutions[i].cost ? +item.resolutions[i].cost : 0;
        }
      }
      return +item.revisionCost + resolutionsCost;
    };

    vm.getItemLatResolutionDate = function (item) {
      var itemLatResolutionDate = '';
      if (item.resolutions.length > 0) {
        itemLatResolutionDate = item.resolutions[item.resolutions.length - 1].creationDate;
      }
      return itemLatResolutionDate;
    };


    vm.getItemStatuses = function (item) {
      if (!vm.isCloseItemsList) {
        return ['Cerrado - Entregado', 'Cerrado - Desechado'];
      } else {
        if (item.notifications && item.notifications.length > 0) {
          return [item.notifications[item.notifications.length - 1].status];
        } else if (item.resolutions && item.resolutions.length > 0) {
          return [item.resolutions[item.resolutions.length - 1].condition];
        } else {
          return ['Ingresado'];
        }
      }
    };

    vm.getStatusClass = function (item) {
      switch (item.status) {
        case 'Ingresado':
          return 'active';
          break;
        case 'Taller - En reparación':
          return 'active';
          break;
        case 'Taller - Reparado':
          return 'success';
          break;
        case 'Taller - No se puede reparar':
          return 'danger';
          break;
        case 'Taller - No hay repuestos':
          return 'danger';
          break;
        case 'Taller - Pendiente de repuestos':
          return 'warning';
          break;
        case 'Cliente - Notificado':
          return 'info';
          break;
        case 'Cliente - No se puede contactar':
          return 'warning';
          break;
        case 'Cerrado - Entregado':
          return 'info';
          break;
        case 'Cerrado - Desechado':
          return 'danger';
          break;
      }
    };

    vm.updateStatus = function (item) {
      if (item.status !== status) {
        if (confirm('Seguro que desea cambiar el estado al articulo #' + item.itemNumber + ' a ' + item.status + '?')) {
          var successMessage = 'El nuevo estado del artículo # ' + item.itemNumber +
            ' es: ' + item.status;
          vm.updateItem(item, successMessage);
        } else {
          item.status = item.oldStatus;
        }
      }
    };

    vm.updateItem = function (item, successMessage) {
      _.remove(vm.items, {
        _id: item._id
      });
      vm.tableParams.reload();
      function successCallback(res) {
        Notification.info({
          title: 'Artículo actualizado exitosamente!',
          message: successMessage,
          delay: 1000
        });
      }

      function errorCallback(res) {
        vm.tableParams.reload();
        Notification.error({
          title: 'Error al actualizar el artículo!',
          message: 'No se pudo actualizar la artículo # ' + item.itemNumber,
          delay: 15000
        });
      }

      return item.$update(successCallback, errorCallback);
    };
  }
}());
