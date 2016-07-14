'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('patients', {
        url: '/patients',
        template: '<patients></patients>'
      });
  });
