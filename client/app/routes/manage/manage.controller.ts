'use strict';
(function(){

class ManageComponent {
  constructor($http) {
    this.$http = $http;
    this.$http.get('/api/programs').success(programs => {
      this.programs = programs;
      console.log(programs)
    })
    this.$http.get('/api/questions').success(questions => {
      this.questions = questions;
      console.log(questions)
    })
  }
}

angular.module('riverApp')
  .component('manage', {
    templateUrl: 'app/routes/manage/manage.html',
    controller: ManageComponent
  });

})();
