'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile?id',
        template: '<profile></profile>'
      });
  });
