'use strict';

angular.module('riverApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conversations-view', {
        url: '/conversations/view?:id',
        template: '<view></view>'
      });
  });
