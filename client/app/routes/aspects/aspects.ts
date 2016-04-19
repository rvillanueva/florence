'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('aspects', {
        url: '/aspects',
        template: '<aspects></aspects>'
      });
  });
