'use strict';
(function(){

class ConversationsComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('riverApp')
  .component('conversations', {
    templateUrl: 'app/routes/conversations/conversations.html',
    controller: ConversationsComponent
  });

})();
