'use strict';
(function(){

angular.module('riverApp')
  .controller('StepEditorModalController', function($scope, $uibModalInstance, conversation, stepId){
    $scope.stepId = stepId;
    $scope.conversation = conversation;
    $scope.index = {
      s: null,
      p: 0
    };
    $scope.pathIndex = 0;
    $scope.isPristine = true;
    $scope.newMessage = {
      type: 'text',
      text: ''
    };

    $scope.addMessage = function(){
      var added = angular.copy($scope.newMessage);
      $scope.conversation.steps[$scope.index.s].messages = $scope.conversation.steps[$scope.index.s].messages || [];
      $scope.conversation.steps[$scope.index.s].messages.push(added);
      $scope.newMessage.text = '';
    }

    $scope.deleteMessage = function(index){
      var confirm = window.confirm('Are you sure you want to delete this message?');
      if(confirm){
        $scope.conversation.steps[$scope.index.s].messages.splice(index, 1);
      }
    }

    $scope.addPath = function(){
      $scope.conversation.steps[$scope.index.s].paths = $scope.conversation.steps[$scope.index.s].paths || [];
      $scope.conversation.steps[$scope.index.s].paths.push({
        name: 'New path'
      })
      $scope.index.p = $scope.conversation.steps[$scope.index.p].paths.length - 1;
    }

    $scope.deletePath = function(index){
      var confirm = window.confirm('Are you sure you want to delete this path?')
      if(confirm){
        $scope.conversation.steps[$scope.index.s].paths.splice(index, 1);
        if($scope.index.p >= index){
          $scope.index.p --;
        }
      }
    }

    $scope.deleteStep = function(index){
      var confirm = window.confirm('Are you sure you want to delete this step?')
      if(confirm){
        console.log('Deleting step '+ index)
        $scope.conversation.steps.splice(index, 1);
        if($scope.index.s >= index){
          $scope.index.s --;
        }
        $scope.save();
      }
    }


    $scope.addPattern = function(pattern){
      $scope.conversation.steps[$scope.index.s].paths[$scope.index.p].patterns = $scope.conversation.steps[$scope.index.s].paths[$scope.index.p].patterns || [];
      $scope.conversation.steps[$scope.index.s].paths[$scope.index.p].patterns.push(pattern);
    }

    $scope.save = function(){
      pristine()
      $uibModalInstance.close($scope.conversation);
    }

    $scope.cancel = function () {
      var alert = true;
      if(!$scope.isPristine){
        alert = window.confirm('There are unsaved changes. Are you sure you want to quit?')
      }
      if(alert){
        $uibModalInstance.dismiss('cancel');
      }
    };


    var pristine = $scope.$watch('conversation', function(newVal, oldVal) {
      if(newVal !== oldVal){
        console.log('Dirtied')
        $scope.isPristine = false;
        pristine();
      }
    }, true);

    if(!$scope.stepId){
      console.log('Creating new step...')
        $scope.conversation.steps.push({
          type: 'message',
          next: {
            action: 'end'
          },
          name: 'New step'
        })
        $scope.index.s = $scope.conversation.steps.length - 1;
    } else {
      angular.forEach($scope.conversation.steps,function(step, s){
        if(step._id == $scope.stepId){
          $scope.index.s = s;
        }
      })
    }


  });

})();
