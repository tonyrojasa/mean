(function () {
  'use strict';

  angular
    .module('items.services')
    .factory('WorkshopItemsService', WorkshopItemsService);

  WorkshopItemsService.$inject = ['$resource', '$log'];

  function WorkshopItemsService($resource, $log) {
    var Item = $resource('/api/items/workshop/:workshopId', {
      itemId: '@_id'
    }, {
        query: {
          method: 'GET',
          isArray: true
        }
      });

    angular.extend(Item.prototype, {
      createOrUpdate: function () {
        var item = this;
        return createOrUpdate(item);
      }
    });

    return Item;

    function createOrUpdate(item) {
      if (item._id) {
        return item.$update(onSuccess, onError);
      } else {
        return item.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(item) {
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
