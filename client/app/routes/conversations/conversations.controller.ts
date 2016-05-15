'use strict';
(function(){

class ConversationsComponent {
  constructor($http, $state, Conversation) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
    this.conversations = [];
    this.conversationService = Conversation;
    this.$http.get('/api/conversations').success(convos => {
      this.conversations = convos;
    })
  }
  addConversation(){
    var name = window.prompt('What\'s the name your new conversation?');
    var newConvo = {
      name: name
    }
    if(name){
      this.conversationService.create(newConvo)
      .then(convo => {
        this.$state.go('conversations-view', {id:convo._id})
      })
    }
  }
}

angular.module('riverApp')
  .component('conversations', {
    templateUrl: 'app/routes/conversations/conversations.html',
    controller: ConversationsComponent
  });

})();
