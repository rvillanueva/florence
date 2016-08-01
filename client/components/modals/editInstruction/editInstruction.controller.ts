'use strict';
(function() {

  class EditInstructionModalComponent {
    constructor($uibModalInstance, $q, $http, params, $httpParamSerializer){
      this.$http = $http;
      this.$q = $q;
      this.params = params;
      this.$httpParamSerializer = $httpParamSerializer;
      this.instruction = params.instruction;
      this.$uibModalInstance = $uibModalInstance;
      this.isNew;
      if(this.instruction._id){
        this.isNew = false;
      } else {
        this.isNew = true;
      }
      this.getTask();
    }
    getTask(){
      this.$http.post('/api/tasks/instruction', this.instruction).success(task => {
        console.log(task);
        this.task = task;
      })
    }
    done(){
      this.$uibModalInstance.close(this.instruction);
    }
  }

  angular.module('riverApp')
    .controller('EditInstructionModalController', EditInstructionModalComponent);
})();
