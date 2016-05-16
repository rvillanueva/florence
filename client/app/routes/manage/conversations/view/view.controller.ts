'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation, Intent, $stateParams, $state, $scope) {
      this.conversationService = Conversation;
      this.intentService = Intent;
      this.$scope = $scope;
      this.isPristine;
      this.watcher;
      this.conversation;
      this.map = {};
      this.intents = {};
      if(!$stateParams.id){
        $state.go('conversations');
      } else {
        this.conversationService.getById($stateParams.id).then(convo => {
          if(!convo){
            $state.go('conversations');
          }
          this.conversation = convo;
          console.log(convo)
          this.buildStepMap(convo);
          this.isPristine = true;
          this.setWatcher();
        })
        this.intentService.getAll().then(intents => {
          this.buildIntentMap(intents)
        })
      }
    }

    buildStepMap(convo){
      angular.forEach(this.conversation.steps, (step, s) => {
        this.map[step._id] = step;
      })
    }

    buildIntentMap(intents){
      angular.forEach(intents, (intent, s) => {
        this.intents[intent._id] = intent;
      })
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
    .component('conversationView', {
    templateUrl: 'app/routes/manage/conversations/view/view.html',
    controller: ConversationViewComponent
  });
})();

angular.module('riverApp')
  .controller('ConversationLineController', function($scope){
    $scope.hidden = true;
    $scope.toggleHidden = function(){
      $scope.hidden = !$scope.hidden;
    }
  });
