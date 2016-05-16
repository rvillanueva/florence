'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('intents', {
        url: '/manage/intents',
        template: '<intents></intents>'
      });
  });
