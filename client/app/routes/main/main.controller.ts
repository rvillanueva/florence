'use strict';

(function() {

class MainController {

  constructor(ModalService) {
    this.ModalService = ModalService;
    this.commandCenter = {
      patients: [],
      messages: []
    }
    this.patientSearchQuery = '';
  }
  searchPatients(){
    console.log('Searching patients...')
    this.ModalService.open({
      templateUrl: 'components/modals/searchPatients/searchPatients.html',
      controller: 'SearchPatientsModalController as vm',
      params: {
        query: this.patientSearchQuery;
      }
    })
    .then(patient => {
      this.commandCenter.patients.push(patient);
    })
  }
  removePatient(index){
    this.commandCenter.patients.splice(index, 1);
  }
}

angular.module('riverApp')
  .component('main', {
    templateUrl: 'app/routes/main/main.html',
    controller: MainController
  });

})();
