'use strict';
(function() {

  class SearchPatientsModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.$http.get('/api/users').success(patients => {
        this.patients = patients;
      })
      this.$uibModalInstance = $uibModalInstance;
    }
    select(patient){
      this.$uibModalInstance.close(patient)
    }
  }

  angular.module('florenceApp')
    .controller('SearchPatientsModalController', SearchPatientsModalComponent);
})();
