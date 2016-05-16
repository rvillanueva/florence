'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conversations', {
        url: '/manage/conversations',
        template: '<conversations></conversations>'
      });
  });
