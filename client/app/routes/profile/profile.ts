'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile?id',
        template: '<profile></profile>'
      });
  });
