'use strict';

(function() {

class MainController {

  constructor(ModalService, $http, $q) {
    this.ModalService = ModalService;
    this.$http = $http;
    this.$q = $q;
    this.view = {
      main: 'instructions'
    }
    this.selected = {
      patient: false,
      messages: [{
        from: {
          userId: 'me'
        },
        content: {
          text: 'Hi!'
        }
      }],
      instruction: false
    }
    this.stagedInstructions = [];
    this.patientSearchQuery = '';
    this.$http.get('/api/users').success(patients => {
      console.log(patients)
      this.patients = patients;
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
      this.patients.push(patient);
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
      console.log(patient);
      this.view.main = 'instructions';
      this.selected = {
        patient: patient,
        messages: []
      };
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
  notify(patientId){
    this.$http.post('/api/users/' + patientId + '/notify').success(queue => {
      this.selected.patient.queue = queue;
    })
    .error(err => {
      window.alert(err)
    })

  }
  viewPatientResponses(){
    this.view.main = 'data';
    this.getPatientResponses();
  }
  getPatientResponses(){
    this.$http.get('/api/users/' + this.selected.patient._id + '/entries').success(entries => {
      this.selected.entries = entries;
      console.log(entries);
    })
    .error(err => {
      window.alert(err)
    })
  }
  addInstruction(){
    if(this.instructionInput.text.length > 0){
      this.$http.get('/api/instructions?q=' + this.instructionInput.text).success(instruction => {
        console.log(instruction);
        instruction = this.updateMeasurementType(instruction)
        this.stagedInstructions.push(instruction);
        console.log(this.selected.instructions)
      })
      .error(err => {
        window.alert(err)
      })
      this.instructionInput.text = '';
    }
  }
  updateMeasurementType(instruction){
    var timingType;
    instruction.action = instruction.action || {};
    instruction.action.timing = instruction.action.timing || {};
    instruction.measurement = instruction.measurement || {};
    timingType = instruction.action.timing.type;

    if(timingType == 'once'){
      instruction.measurement.type = 'taskCompletion';
    } else if(timingType == 'repeating'){
      instruction.measurement.type = 'missedFrequency';
    } else if (timingType == 'general'){
      instruction.measurement.type = 'propensity';
    }
    return instruction;
  }
}

angular.module('riverApp')
  .component('main', {
    templateUrl: 'app/routes/main/main.html',
    controller: MainController
  });

})();
