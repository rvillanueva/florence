'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('intents-view', {
        url: '/intents/view?:id',
        template: '<intents-view></intents-view>'
      });
  });
