'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('task-view', {
        url: '/tasks/view?:id',
        template: '<task-view></task-view>'
      });
  });
