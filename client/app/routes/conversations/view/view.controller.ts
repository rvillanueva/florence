'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation, $stateParams, $state, $scope) {
      this.conversationService = Conversation;
      this.$scope = $scope;
      this.isPristine;
      this.watcher;
      this.conversation;
      this.index = {
        s: null,
        p: 0
      }
      this.tab = {
        id: null
      }
      if(!$stateParams.id){
        $state.go('conversations');
      } else {
        this.conversationService.getById($stateParams.id).then(convo => {
          this.conversation = convo;
          this.isPristine = true;
          this.setWatcher();
          this.tab.id = 'map';
        })
      }
    }

    editStep(stepId){
      console.log(stepId)
      if(!stepId){
          $scope.step={
            type: 'message',
            next: {
              action: 'end'
            },
            name: 'New step'
          }
          this.index.s = this.conversation.steps.length - 1;
      } else {
        this.index.s = this.getStepIndex(stepId);
      }
    }

    getStepIndex(stepId){
      var found;
      angular.forEach(this.conversation.steps,function(step, s){
        if(step._id == stepId){
          found = s;
        }
      })
      return found;
    }

    save(updated){
      updated = updated || this.conversation;
      this.conversationService.save(updated).then(convo => {
        this.conversation = convo;
        this.isPristine = true;
        this.setWatcher();
      })
    }

    setWatcher(){
      this.watcher = this.$scope.$watch('$ctrl.conversation', (newVal, oldVal) => {
        if(newVal !== oldVal){
          console.log('Dirtied')
          this.isPristine = false;
          this.watcher();
        }
      }, true);
    }

  }

  angular.module('riverApp')
    .component('view', {
    templateUrl: 'app/routes/conversations/view/view.html',
    controller: ConversationViewComponent
  });
})();
