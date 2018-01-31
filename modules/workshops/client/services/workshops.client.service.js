(function () {
  'use strict';

  angular
    .module('workshops.services')
    .factory('WorkshopsService', WorkshopsService);

  WorkshopsService.$inject = ['$resource', '$log'];

  function WorkshopsService($resource, $log) {
    var Workshop = $resource('/api/workshops/:workshopId', {
      workshopId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Workshop.prototype, {
      createOrUpdate: function () {
        var workshop = this;
        return createOrUpdate(workshop);
      }
    });

    return Workshop;

    function createOrUpdate(workshop) {
      if (workshop._id) {
        return workshop.$update(onSuccess, onError);
      } else {
        return workshop.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(workshop) {
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
