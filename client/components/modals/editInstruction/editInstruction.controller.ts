'use strict';
(function() {

  class EditInstructionModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.instruction = params.instruction;
      this.$uibModalInstance = $uibModalInstance;
    }
    done(){
      this.$uibModalInstance.close(this.instruction);
    }
  }

  angular.module('riverApp')
    .controller('EditInstructionModalController', EditInstructionModalComponent);
})();
