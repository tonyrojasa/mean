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
      { id: 'Taller - Enviado', title: 'Taller - Enviado' },
      { id: 'Taller - En reparación', title: 'Taller - En reparación' },
      { id: 'Taller - Reparado', title: 'Taller - Reparado' },
      { id: 'Taller - No reparado', title: 'Taller - No reparado' },
      { id: 'Entregado a dueño', title: 'Entregado a dueño' },
      { id: 'Desechado', title: 'Desechado' }];

    vm.isStatusClosable = function (status) {
      return (status === 'Taller - Reparado'
          || status === 'Taller - No se puede reparar'
          || status === 'Taller - No hay repuestos'
          || status.indexOf('Cliente') > 0) || vm.isCloseItemsList;
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
        case 'Taller - Reparado':
          return 'success';
          break;
        case 'Taller - No se puede reparar':
          return 'danger';
          break;
        case 'Taller - No hay repuestos':
          return 'danger';
          break;
        case 'Pendiente de repuestos':
          return 'warning';
          break;
        case 'Cliente - Notificado':
          return 'info';
          break;
        case 'Cliente - No se puede contactar':
          return 'danger';
          break;
        case 'Cerrado - Entregado':
          return 'info';
          break;
        case 'Cerrado - Desechado':
          return 'danger';
          break;
      }
    };

    vm.updateStatus = function (item, status) {
      if (item.status !== status) {
        item.status = status;
        var successMessage = 'El nuevo estado del artículo # ' + item.itemNumber +
          ' es: ' + item.status;
        vm.updateItem(item, successMessage);
      }
    };

    vm.updateItem = function (item, successMessage) {
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
