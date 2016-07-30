'use strict';

angular.module('riverApp')
  .controller('InstructionItemController', function($scope, ModalService, $http) {
    $scope.selected = false;
    $scope.toggleExpansion = function(){
      $scope.expanded = !$scope.expanded;
    }
    $scope.edit = function(){
      ModalService.open({
        templateUrl: 'components/modals/editInstruction/editInstruction.html',
        controller: 'EditInstructionModalController as vm',
        params: {
          instruction: $scope.instruction
        }
      })
      .then(instruction => {
        $scope.updateInstruction(instruction);
      })

    }

    $scope.updateInstruction = function(instruction){
      $http.put('/api/instructions/' + instruction._id, instruction)
      .success(user => {
        $scope.$parent.$ctrl.selected.patient = user;
      })
      .error(err => {
        window.alert(err);
      })
    }
  });
