'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('start', {
        url: '/login/start',
        template: '<start></start>'
      });
  });
