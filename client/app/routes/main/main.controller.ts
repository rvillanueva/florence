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
    this.now = new Date();
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
    // Placeholder
  }
  addNewPatient(){
    this.ModalService.open({
      templateUrl: 'components/modals/createUser/createUser.html',
      controller: 'CreateUserModalController as vm',
      size: 'sm',
      params: {
      }
    })
    .then(patient => {
      patient.adherence = {
        score: 0.5
      }
      this.patients.push(patient);
      this.selectPatient(patient._id);
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
        this.confirmAddedInstruction(instruction);
        console.log(this.selected.instructions)
      })
      .error(err => {
        window.alert(err)
      })
      this.instructionInput.text = '';
    }
  }
  confirmAddedInstruction(instruction){
    this.ModalService.open({
      templateUrl: 'components/modals/editInstruction/editInstruction.html',
      controller: 'EditInstructionModalController as vm',
      params: {
        instruction: instruction
      }
    })
    .then(instruction => {
      // TODO add proper saving here
      this.saveInstruction(instruction);
    })
  }
  saveInstruction(instruction){
    var deferred = this.$q.defer();
    this.$http.post('/api/instructions?userId=' + this.selected.patient._id, instruction)
    .success(user => {
      console.log(user)
      this.selected.patient = user;
      deferred.resolve(user)
    })
    .error(err => {
      window.alert(err);
    })
    return deferred.promise;
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
  updateIdentity(form, user, scope){
    if (form.$valid && user.identity) {
      this.$http.put('/api/users/' + this.selected.patient._id + '/identity', user.identity).success(updated => {
        console.log(updated)
        this.selected.patient = updated;
        scope.editing = false;
      })
      .error(err => {
        this.errors = {};

        // Update validity of form fields that match the sequelize errors
        if (err.name && err.errors) {
          angular.forEach(err.errors, (error, field) => {
            form[field].$setValidity('mongoose', false);
            this.errors[field] = error.message;
          });
        }
        console.log(this.errors);
      });
    }
  }
}

angular.module('florenceApp')
  .component('main', {
    templateUrl: 'app/routes/main/main.html',
    controller: MainController
  });

})();
