'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('program-view', {
        url: '/programs/view?:id',
        template: '<program-view></program-view>'
      });
  });
