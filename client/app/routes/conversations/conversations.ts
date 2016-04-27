'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conversations', {
        url: '/conversations',
        template: '<conversations></conversations>'
      });
  });
