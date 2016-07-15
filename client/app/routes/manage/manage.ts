'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('manage', {
        url: '/manage',
        template: '<manage></manage>'
      });
  });
