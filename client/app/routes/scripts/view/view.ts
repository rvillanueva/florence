'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('view', {
        url: '/scripts/view?:scriptId',
        template: '<view></view>'
      });
  });
