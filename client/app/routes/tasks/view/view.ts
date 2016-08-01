'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('task-view', {
        url: '/tasks/view?:id',
        template: '<task-view></task-view>'
      });
  });
