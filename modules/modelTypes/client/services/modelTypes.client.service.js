(function () {
  'use strict';

  angular
    .module('modelTypes.services')
    .factory('ModelTypesService', ModelTypesService);

  ModelTypesService.$inject = ['$resource', '$log'];

  function ModelTypesService($resource, $log) {
    var ModelType = $resource('/api/modelTypes/:modelTypeId', {
      modelTypeId: '@_id'
    }, {
        update: {
          method: 'PUT'
        }
      });

    angular.extend(ModelType.prototype, {
      createOrUpdate: function () {
        var modelType = this;
        return createOrUpdate(modelType);
      }
    });

    return ModelType;

    function createOrUpdate(modelType) {
      if (modelType._id) {
        return modelType.$update(onSuccess, onError);
      } else {
        return modelType.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(modelType) {
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
