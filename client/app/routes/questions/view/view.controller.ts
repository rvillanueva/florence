'use strict';
(function() {

  class QuestionViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
      this.editingMode = false;
      if(!$stateParams.id){
        $state.go('questions');
      } else {
        this.$http.get('/api/questions/' + $stateParams.id).success(question => {
          if(!question){
            $state.go('questions');
          }
          this.question = question;
          console.log(question);
        })
        .error(err => {
          $state.go('questions');
        })
      }
    }
    toggleEditingModeOn(){
      this.editingMode = true;
    }
    setupRecode(c){
      console.log('recoding choice index ' + c)
      var choice = this.question.choices[c];
      choice = choice || {};
      choice.stored = choice.stored || {};
      if(!choice.stored.type){
        choice.stored.type = 'number'
      }
      console.log(choice)
    }
    addChoice(){
      this.question.choices = this.question.choices || [];
      var newChoice = {
        pattern: {
          type: 'match'
        }
      }
      this.question.choices.push(newChoice);
    }
    deleteChoice(c){
      this.question.choices.splice(c, 1)
    }
  }

  angular.module('riverApp')
    .component('questionView', {
    templateUrl: 'app/routes/questions/view/view.html',
    controller: QuestionViewComponent
  });
})();
