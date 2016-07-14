'use strict';
(function(){

class PatientsComponent {
  constructor($http) {
    this.$http = $http;
    this.$http.get('/api/users').success(patients => {
      this.patients = patients;
    })
  }
}

angular.module('riverApp')
  .component('patients', {
    templateUrl: 'app/routes/patients/patients.html',
    controller: PatientsComponent
  });

})();
