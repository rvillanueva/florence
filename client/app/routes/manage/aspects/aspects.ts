'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('aspects', {
        url: '/manage/aspects',
        template: '<aspects></aspects>'
      });
  });
