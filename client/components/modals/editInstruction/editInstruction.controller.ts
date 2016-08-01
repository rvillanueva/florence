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
      this.timeframeQuery = '';
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
    updateTimeframe(){
      this.instruction.action.timing = this.instruction.action.timing || {};
      this.instruction.action.timing.timeframe = this.instruction.action.timing.timeframe || {};
      if(this.timeframeQuery.length > 0){
        this.$http.get('/api/parse?text=' + this.timeframeQuery)
        .success(parsed => {
          console.log(parsed);
          if(parsed.entities && parsed.entities.datetime && parsed.entities.datetime.length > 0){
            var result = parsed.entities.datetime[0];
            if(result.type == 'value'){
              this.instruction.action.timing.timeframe.to = result.value;
              this.instruction.action.timing.timeframe.from = result.value;
            } else if (result.type == 'interval'){
              this.instruction.action.timing.timeframe.to = result.to.value;
              this.instruction.action.timing.timeframe.from = result.from.value;
            }
            console.log(this.instruction.action.timing);
          }
        })
        .error(err => {
          window.alert(err);
        })
        this.timeframeQuery = '';
      }
    }
  }

  angular.module('florenceApp')
    .controller('EditInstructionModalController', EditInstructionModalComponent);
})();
