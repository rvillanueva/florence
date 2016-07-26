'use strict';

(function() {

class MainController {

  constructor(ModalService, $http, $q) {
    this.ModalService = ModalService;
    this.$http = $http;
    this.$q = $q;
    this.selected = {
      patient: [],
      messages: [{
        from: {
          userId: 'me'
        },
        content: {
          text: 'Hi!'
        }
      }]
    }
    this.patientSearchQuery = '';
    this.$http.get('/api/users').success(patients => {
      console.log(patients)
      this.patients = patients;
      this.selected.patient = patients[0]
    })
  }
  searchPatients(){
    console.log('Searching patients...')
    this.ModalService.open({
      templateUrl: 'components/modals/searchPatients/searchPatients.html',
      controller: 'SearchPatientsModalController as vm',
      params: {
        query: this.patientSearchQuery
      }
    })
    .then(patient => {
      this.commandCenter.patients.push(patient);
    })
  }
  createPatient(){
    this.ModalService.open({
      templateUrl: 'components/modals/createUser/createUser.html',
      controller: 'CreateUserModalController as vm',
      params: {
      }
    })
    .then(patient => {
      this.patients.splice(0,0,patient);
    })
  }
  removePatient(index){
    this.commandCenter.patients.splice(index, 1);
  }
  selectPatient(patientId){
    this.getPatientById(patientId)
    .then(patient => {
      this.selected.patient = patient;
      console.log(patient)
    })
    .catch(err => {
      window.alert(err)
    })
  }
  getPatientById(patientId){
    var deferred = this.$q.defer();
    this.$http.get('/api/users/' + patientId).success(patient => {
      deferred.resolve(patient)
    })
    .error(err => {
      deferred.reject(err)
    })
    return deferred.promise;
  }
}

angular.module('riverApp')
  .component('main', {
    templateUrl: 'app/routes/main/main.html',
    controller: MainController
  });

})();
