'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('verify', {
        url: '/login/verify?vId&token',
        template: '<verify></verify>'
      });
  });
