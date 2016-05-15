'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('intents', {
        url: '/intents',
        template: '<intents></intents>'
      });
  });
