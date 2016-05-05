'use strict';
(function(){

angular.module('riverApp')
  .controller('ConversationEditStepController', function($scope, PathEditModal){
    $scope.conversation = $scope.$ctrl.conversation;
    $scope.isPristine = true;
    $scope.newMessage = {
      type: 'text',
      text: ''
    };

    $scope.addMessage = function(){
      var added = angular.copy($scope.newMessage);
      $scope.conversation.steps[$scope.$ctrl.index.s].messages = $scope.conversation.steps[$scope.$ctrl.index.s].messages || [];
      $scope.conversation.steps[$scope.$ctrl.index.s].messages.push(added);
      $scope.newMessage.text = '';
    }

    $scope.deleteMessage = function(index){
      var confirm = window.confirm('Are you sure you want to delete this message?');
      if(confirm){
        $scope.conversation.steps[$scope.$ctrl.index.s].messages.splice(index, 1);
      }
    }

    $scope.addPath = function(){
      $scope.conversation.steps[$scope.$ctrl.index.s].paths = $scope.conversation.steps[$scope.$ctrl.index.s].paths || [];
      $scope.conversation.steps[$scope.$ctrl.index.s].paths.push({
        name: 'New path'
      })
      $scope.$ctrl.index.p = $scope.conversation.steps[$scope.$ctrl.index.p].paths.length - 1;
    }

    $scope.deletePath = function(index){
      var confirm = window.confirm('Are you sure you want to delete this path?')
      if(confirm){
        $scope.conversation.steps[$scope.$ctrl.index.s].paths.splice(index, 1);
        if($scope.$ctrl.index.p >= index){
          $scope.$ctrl.index.p --;
        }
      }
    }

    $scope.deleteStep = function(index){
      var confirm = window.confirm('Are you sure you want to delete this step?')
      if(confirm){
        console.log('Deleting step '+ index)
        $scope.conversation.steps.splice(index, 1);
        if($scope.$ctrl.index.s >= index){
          $scope.$ctrl.index.s --;
        }
        $scope.save();
      }
    }


    $scope.addPattern = function(pattern){
      $scope.conversation.steps[$scope.$ctrl.index.s].paths[$scope.$ctrl.index.p].patterns = $scope.conversation.steps[$scope.$ctrl.index.s].paths[$scope.$ctrl.index.p].patterns || [];
      $scope.conversation.steps[$scope.$ctrl.index.s].paths[$scope.$ctrl.index.p].patterns.push(pattern);
    }

    $scope.saveStep = function(){
      var spliced = false;
      angular.forEach($scope.$ctrl.conversations.steps, function(step, s){
        if(step._id && step._id == $scope.stepId){
          $scope.$ctrl.conversations.steps.splice(s, 1, $scope.step);
          spliced = true;
        }
      }
      if(!spliced){
        $scope.$ctrl.conversations.steps.push($scope.step);
      }
      $scope.$ctrl.save();
      $scope.$ctrl.tab.id = 'map';
    }

    $scope.cancel = function () {
      var confirm = true;
      if(!$scope.isPristine){
        confirm = window.confirm('There are unsaved changes. Are you sure you want to quit?')
      }
      if(confirm){
        $uibModalInstance.cancel();
      }
    };


    var pristine = $scope.$watch('conversation', function(newVal, oldVal) {
      if(newVal !== oldVal){
        console.log('Dirtied')
        $scope.isPristine = false;
        pristine();
      }
    }, true);

    $scope.openPath = function(p){
      PathEditModal.open($scope.conversation, $scope.$ctrl.index.s, p)
      .then(convo => $scope.$ctrl.save(convo))
      .then(() => $scope.buildGraph())
    }

  });

})();
