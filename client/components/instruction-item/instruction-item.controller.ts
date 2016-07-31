'use strict';

angular.module('riverApp')
  .controller('InstructionItemController', function($scope, ModalService, $http) {
    $scope.selected = false;
    $scope.userId = $scope.$parent.$ctrl.selected.patient._id;

    $scope.entries = [];
    $scope.toggleExpansion = function(){
      $scope.expanded = !$scope.expanded;
      if($scope.expanded){
        $http.get('/api/users/' + $scope.userId + '/entries?instructionId=' + $scope.instruction._id)
        .success(entries => {
          $scope.entries = entries;
          console.log($scope.entries);
        })
        .error(err => {
          window.alert(err)
          console.log(err)
        })
      }
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
