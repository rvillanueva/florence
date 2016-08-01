'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('manage', {
        url: '/manage',
        template: '<manage></manage>'
      });
  });
