'use strict';
(function(){

class QuestionsComponent {
  constructor($http) {
    this.$http = $http;
    this.$http.get('/api/questions').success(questions => {
      this.questions = questions;
    })
  }
}

angular.module('riverApp')
  .component('questions', {
    templateUrl: 'app/routes/questions/questions.html',
    controller: QuestionsComponent
  });

})();
