'use strict';

angular.module('florenceApp')
  .directive('messageBox', function() {
    return {
      templateUrl: 'components/message-box/message-box.html',
      restrict: 'EA',
      controller: 'MessageBoxController',
      controllerAs: 'mb',
      scope: {
        messages: '='
      }
    };
  });
