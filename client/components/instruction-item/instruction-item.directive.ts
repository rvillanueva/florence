'use strict';

angular.module('florenceApp')
  .directive('instructionItem', function() {
    return {
      templateUrl: 'components/instruction-item/instruction-item.html',
      restrict: 'EA',
      controller: 'InstructionItemController',
      controllerAs: 'ii',
      scope: {
        instruction: '='
      }
    };
  });
