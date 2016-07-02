'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('programs', {
        url: '/programs',
        template: '<programs></programs>'
      });
  });
