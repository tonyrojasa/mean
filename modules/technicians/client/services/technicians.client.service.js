(function () {
  'use strict';

  angular
    .module('technicians.services')
    .factory('TechniciansService', TechniciansService);

  TechniciansService.$inject = ['$resource', '$log'];

  function TechniciansService($resource, $log) {
    var Technician = $resource('/api/technicians/:technicianId', {
      technicianId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Technician.prototype, {
      createOrUpdate: function () {
        var technician = this;
        return createOrUpdate(technician);
      }
    });

    return Technician;

    function createOrUpdate(technician) {
      if (technician._id) {
        return technician.$update(onSuccess, onError);
      } else {
        return technician.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(technician) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
