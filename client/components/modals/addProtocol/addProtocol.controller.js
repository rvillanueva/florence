'use strict';
(function() {

  class AddProtocolModalComponent {
    constructor($uibModalInstance, $q, params) {
      this.protocolType = params.protocolType;
      this.$uibModalInstance = $uibModalInstance;
    }
    done(){
      this.$uibModalInstance.close('test')
    }
  }

  angular.module('riverApp')
    .controller('AddProtocolModalController', AddProtocolModalComponent);
})();
