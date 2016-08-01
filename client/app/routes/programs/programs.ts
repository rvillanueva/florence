'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('programs', {
        url: '/programs',
        template: '<programs></programs>'
      });
  });
