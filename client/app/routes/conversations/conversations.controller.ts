'use strict';
(function(){

class ConversationsComponent {
  constructor($http) {
    this.message = 'Hello';
    this.$http = $http;
    this.$http.get('/api/conversations').success(function(body){
      console.log(body)
    })
  }
}

angular.module('riverApp')
  .component('conversations', {
    templateUrl: 'app/routes/conversations/conversations.html',
    controller: ConversationsComponent
  });

})();
