'use strict';

angular.module('riverApp')
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
