(function () {
  'use strict';

  angular
    .module('colors.admin')
    .controller('ColorsAdminController', ColorsAdminController);

  ColorsAdminController.$inject = ['$scope', '$state', '$window', 'colorResolve', 'Authentication', 'Notification'];

  function ColorsAdminController($scope, $state, $window, color, Authentication, Notification) {
    var vm = this;

    vm.color = color;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Color
    function remove() {
      if ($window.confirm('Esta seguro que desea eliminar este color??')) {
        vm.color.$remove(function (result) {
          $state.go('admin.colors.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color borrado correctamente!' });
        }, function (error) {
          if (error && error.data && error.data.message === 'document is used') {
            Notification.error({ message: 'Este registro se esta utilizando en otro modulo.', title: '<i class="glyphicon glyphicon-remove"></i> No se puede borrar!' });
          }
        });
      }
    }

    // Save Color
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.colorForm');
        return false;
      }

      // Create a new color, or update the current instance
      vm.color.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.colors.list'); // should we send the User to the list or the updated Color's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Color saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Color save error!' });
      }
    }
  }
}());
