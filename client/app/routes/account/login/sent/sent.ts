'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sent', {
        url: '/login/sent',
        template: '<sent></sent>'
      });
  });
