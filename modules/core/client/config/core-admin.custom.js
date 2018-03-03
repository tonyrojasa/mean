(function () {
  'use strict';

  angular
    .module('core.admin')
    .run(customConfig);

  customConfig.$inject = ['uibPaginationConfig'];

  function customConfig(uibPaginationConfig) {
    uibPaginationConfig.firstText = 'Primero';
    uibPaginationConfig.lastText = 'Último';
    uibPaginationConfig.nextText = 'Siguiente';
    uibPaginationConfig.previousText = 'Anterior';
  }
}());
