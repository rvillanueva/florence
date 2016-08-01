'use strict';

angular.module('florenceApp')
  .controller('MessageBoxController', function($scope) {
    console.log('loaded')
    console.log($scope.messages)
  });
