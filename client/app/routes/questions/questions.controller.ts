'use strict';
(function(){

class QuestionsComponent {
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
    this.$http.get('/api/questions').success(questions => {
      this.questions = questions;
    })
  }
  addQuestion(){
    var prompt = window.prompt('What\'s the question text?')
    if(prompt){
      var newQuestion = {
        text: prompt
      }
      this.$http.post('/api/questions', newQuestion).success(question => {
        this.$state.go('question-view', {id: question._id})
      })

    }
  }
}

angular.module('florenceApp')
  .component('questions', {
    templateUrl: 'app/routes/questions/questions.html',
    controller: QuestionsComponent
  });

})();
