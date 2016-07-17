'use strict';
(function() {

  class QuestionViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
      this.editing = {
        addChoice: false
      }
      this.editingMode = false;
      this.newChoice = {
        type: 'category'
      }
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
      var pushed = {
        type: this.newChoice.type
      }
      if(pushed.type == 'category'){
        pushed.category = this.newChoice.term;
        pushed.patterns = [{
          type: 'term'
          term: this.newChoice.term.toLowerCase()
        }]
        console.log(pushed)
      } else if (pushed.type == 'number'){
        pushed.min = this.newChoice.min;
        pushed.max = this.newChoice.max;
      }
      this.question.choices.push(pushed);
      this.newChoice.term = '';
    }
    deleteChoice(c){
      this.question.choices.splice(c, 1)
    }
    addPattern(c){
      this.question.choices[c].patterns = this.question.choices[c].patterns || []
      this.question.choices[c].patterns.push({
        type: 'term'
        term: ''
      })
    }

    cleanChoice(c){
      this.question.choices[c].patterns = this.question.choices[c].patterns || []
      var choice = this.question.choices[c];
      angular.forEach(choice.patterns, function(pattern, p){
        if(pattern.type == 'term' && !pattern.term || pattern.term.length == 0){
          choice.patterns.splice(p, 1);
        } else if (pattern.type == 'expression' && !pattern.expressionKey){
          choice.patterns.splice(p, 1);
        }
      })
    }

  }

  angular.module('riverApp')
    .component('questionView', {
    templateUrl: 'app/routes/questions/view/view.html',
    controller: QuestionViewComponent
  });
})();

class ChoiceRowController {
  constructor() {
    console.log('ChoiceRow init')
    this.editing = false;
  }
  editToggle(toggle){
    console.log('Toggling editing...')
    if(typeof toggle == 'undefined'){
      this.editing == !this.editing;
    } else {
      this.editing = toggle;
    }
  }
}


angular.module('riverApp')
  .controller('ChoiceRowController', ChoiceRowController);
