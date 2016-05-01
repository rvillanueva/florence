'use strict';
(function(){

angular.module('riverApp')
  .controller('StepEditorModalController', function($scope, conversation, stepId){
    $scope.stepId = stepId;
    $scope.conversation = conversation;
    $scope.stepIndex;
    $scope.pathIndex = 0;
    $scope.expanded = {
      patterns: false
    }
    angular.forEach($scope.conversation.steps,function(step, s){
      if(step._id == $scope.stepId){
        $scope.stepIndex = s;
      }
    })
  });

})();
