'use strict';

angular.module('florenceApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('patients', {
        url: '/patients',
        template: '<patients></patients>'
      });
  });
