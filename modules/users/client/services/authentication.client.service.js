(function () {
  'use strict';

  // Authentication service for user variables

  angular
    .module('users.services')
    .factory('Authentication', Authentication);

  Authentication.$inject = ['$window'];

  function Authentication($window) {
    var auth = {
      user: $window.user
    };

    auth.isAdminUser = function () {
      return (auth.user.roles.indexOf('admin') > -1);
    };

    auth.isGuestUser = function () {
      return (auth.user.roles.indexOf('guest') > -1);
    };

    auth.isTechnicianUser = function () {
      return (auth.user.roles.indexOf('technician') > -1);
    };

    return auth;
  }
}());
