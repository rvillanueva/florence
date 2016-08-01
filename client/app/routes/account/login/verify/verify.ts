'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('verify', {
        url: '/login/verify?vId&token',
        template: '<verify></verify>'
      });
  });
