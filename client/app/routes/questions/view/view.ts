'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question-view', {
        url: '/questions/view?:id',
        template: '<question-view></question-view>'
      });
  });
