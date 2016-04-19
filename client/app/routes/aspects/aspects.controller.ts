'use strict';
(function(){

class AspectsComponent {
  constructor($http) {
    this.$http = $http;
    this.aspects = [];
  }
  getAspects(){
    this.$http.get('api/aspects').then(aspects => {
      this.aspects = aspects;
    })
  }
}

angular.module('riverApp')
  .component('aspects', {
    templateUrl: 'app/routes/aspects/aspects.html',
    controller: AspectsComponent
  });

})();
