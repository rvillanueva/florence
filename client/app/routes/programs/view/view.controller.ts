'use strict';
(function() {

  class ProgramViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
      this.$http.get('/api/tasks').success(tasks => {
        this.tasks = tasks;
      })
      if(!$stateParams.id){
        $state.go('programs');
      } else {
        this.$http.get('/api/programs/' + $stateParams.id).success(program => {
          if(!program){
            $state.go('programs');
          }
          this.program = program;
          console.log(program)
        })
      }
    }

  }

  angular.module('riverApp')
    .component('programView', {
    templateUrl: 'app/routes/programs/view/view.html',
    controller: ProgramViewComponent
  });
})();
