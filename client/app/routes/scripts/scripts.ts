'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('scripts', {
        url: '/scripts',
        template: '<scripts></scripts>'
      });
  });
