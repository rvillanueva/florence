'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('questions', {
        url: '/questions',
        template: '<questions></questions>'
      });
  });
