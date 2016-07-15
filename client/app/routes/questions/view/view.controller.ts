'use strict';
(function() {

  class QuestionViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
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
  }

  angular.module('riverApp')
    .component('questionView', {
    templateUrl: 'app/routes/questions/view/view.html',
    controller: QuestionViewComponent
  });
})();
