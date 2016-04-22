'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('verify', {
        url: '/login/verify',
        template: '<verify></verify>'
      });
  });
