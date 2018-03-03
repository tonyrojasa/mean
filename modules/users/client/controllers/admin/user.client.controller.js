(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', 'Authentication', 'userResolve', 'Notification', 'TechniciansService'];

  function UserController($scope, $state, $window, Authentication, user, Notification, TechniciansService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;
    vm.technicians = TechniciansService.query();

    vm.roles = ['Administrador', 'Estándar', 'Técnico', 'Invitado'];


    vm.roles2 = [{
      name: 'Administrador',
      value: 'admin',
      selected: false
    }, {
      name: 'Estándar',
      value: 'user',
      selected: false
    }, {
      name: 'Técnico',
      value: 'inscriptor',
      selected: false
    }, {
      name: 'Invitado',
      value: 'guest',
      selected: false
    }];

    if (!vm.user.roles) {
      vm.user.roles = [];
    } else {
      vm.selectedRole = vm.user.roles;
    }

    vm.onSelectRole = function (role) {
      if (role !== 'Técnico') {
        vm.user.technician = undefined;
      }
      vm.user.roles = [vm.getRoleKeyValue(role)];
    };

    vm.getRoleDisplayValue = function (role) {
      switch (role) {
        case "admin":
          return "Administrador";
          break;
        case "user":
          return "Estándar";
          break;
        case "technician":
          return "Técnico";
          break;
        case "guest":
          return "Invitado";
          break;
      }
    };

    vm.getRoleKeyValue = function (role) {
      switch (role) {
        case "Administrador":
          return "admin";
          break;
        case "Estándar":
          return "user";
          break;
        case "Técnico":
          return "technician";
          break;
        case "Invitado":
          return "guest";
          break;
      }
    }

    vm.parseRoles = function (roleArray) {
      _.forEach(roleArray,
        function (value, key) {
          roleArray[key] = vm.getRoleDisplayValue(vlue);
        });
      var roleValue = roleArray.join(', ');
      return roleValue;
    };

    //check roles when edit mode
    if (vm.user.roles) {
      vm.selectedRole = vm.getRoleDisplayValue(vm.user.roles[0]);
    }

    vm.isTechnicianRole = function () {
      return vm.selectedRole === 'Técnico';
    }

    function remove(user) {
      if ($window.confirm('Seguro que desea eliminar este usuario: ' + user.username + '?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('Usuario eliminado correctamente!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Usuario eliminado correctamente!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      var user = vm.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Datos de usuario: ' + vm.user.username + ' actualizados!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error al actualizar datos del usuario!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }
  }
}());
