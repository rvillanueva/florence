'use strict';
(function(){

angular.module('riverApp')
  .controller('StepEditorModalController', function($scope, $uibModalInstance, conversation, stepId){
    $scope.stepId = stepId;
    $scope.conversation = conversation;
    $scope.stepIndex;
    $scope.pathIndex = 0;
    $scope.expanded = {
      patterns: false
    }
    $scope.copied = $scope.conversation;
    $scope.isPristine = true;
    $scope.newMessage = '';

    if(!stepId){
        $scope.conversation.steps.push({
          name: 'New step'
        })
        $scope.stepIndex = $scope.conversation.steps.length - 1;
    }

    $scope.addMessage = function(){
      var added = {
        type: 'text',
        text: $scope.newMessage
      }
      $scope.conversation.steps[$scope.stepIndex].messages = $scope.conversation.steps[$scope.stepIndex].messages || [];
      $scope.conversation.steps[$scope.stepIndex].messages.push(added);
      $scope.newMessage = '';
    }

    $scope.deleteMessage = function(index){
      var confirm = window.confirm('Are you sure you want to delete this message?');
      if(confirm){
        $scope.conversation.steps[$scope.stepIndex].messages.splice(index, 1);
      }
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
    angular.forEach($scope.conversation.steps,function(step, s){
      if(step._id == $scope.stepId){
        $scope.stepIndex = s;
      }
    })

  });

})();
