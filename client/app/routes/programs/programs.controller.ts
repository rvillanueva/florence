'use strict';
(function(){

class ProgramsComponent {
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
    this.$http.get('/api/programs').success(programs => {
      this.programs = programs;
      console.log(programs)
    })
  }
  addProgram(){
    var name = window.prompt('What\'s the name your new program?');
    var newProgram = {
      name: name
    }
    if(name){
      this.$http.post('/api/programs', newProgram)
      .success(program => {
        this.$state.go('program-view', {id:program._id})
      })
    }
  }
}

angular.module('riverApp')
  .component('programs', {
    templateUrl: 'app/routes/programs/programs.html',
    controller: ProgramsComponent
  });

})();
