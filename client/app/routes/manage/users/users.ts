'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/manage/users',
        template: '<users></users>'
      });
  });
