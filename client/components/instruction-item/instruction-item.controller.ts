'use strict';

angular.module('riverApp')
  .controller('InstructionItemController', function($scope) {
    $scope.selected = false;
    $scope.toggleSelection = function(){
      console.log('Toggled')
      $scope.selected = !$scope.selected;
    }
  });
