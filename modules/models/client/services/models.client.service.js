(function () {
  'use strict';

  angular
    .module('models.services')
    .factory('ModelsService', ModelsService);

  ModelsService.$inject = ['$resource', '$log'];

  function ModelsService($resource, $log) {
    var Model = $resource('/api/models/:modelId', {
      modelId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Model.prototype, {
      createOrUpdate: function () {
        var model = this;
        return createOrUpdate(model);
      }
    });

    return Model;

    function createOrUpdate(model) {
      if (model._id) {
        return model.$update(onSuccess, onError);
      } else {
        return model.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(model) {
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
