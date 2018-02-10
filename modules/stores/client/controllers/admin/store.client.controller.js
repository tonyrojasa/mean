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

    vm.locations = ['Alajuela', 'Cartago', 'Guanacaste', 'Heredia', 'Limón', 'Puntarenas', 'San José'];

    vm.setLocation = function (location) {
      vm.store.location = location;
    };

    // Remove existing Store
    function remove() {
      if ($window.confirm('Esta seguro que desea eliminar esta tienda?')) {
        vm.store.$remove(function () {
          $state.go('admin.stores.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tienda borrada correctamente!!' });
        }, function (error) {
          if (error && error.data && error.data.message === 'document is used') {
            Notification.error({ message: 'Este registro se esta utilizando en otro modulo.', title: '<i class="glyphicon glyphicon-remove"></i> No se puede borrar!' });
          }
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
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tienda guardada exitosamente!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Store save error!' });
      }
    }
  }
}());
