'use strict';
(function(){

class AspectsComponent {
  constructor($http) {
    this.$http = $http;
    this.aspects = [];
    this.getAspects();
  }
  getAspects(){
    this.$http.get('/api/aspects').success(aspects => {
      this.aspects = aspects;
      console.log(aspects);
    })
  }
}

angular.module('riverApp')
  .component('aspects', {
    templateUrl: 'app/routes/manage/aspects/aspects.html',
    controller: AspectsComponent
  });

})();
