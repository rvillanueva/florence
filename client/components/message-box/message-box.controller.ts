'use strict';

angular.module('riverApp')
  .controller('MessageBoxController', function($scope) {
    console.log('loaded')
    console.log($scope.messages)
  });
