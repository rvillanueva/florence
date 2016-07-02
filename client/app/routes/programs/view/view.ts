'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('program-view', {
        url: '/programs/view?:id',
        template: '<program-view></program-view>'
      });
  });
