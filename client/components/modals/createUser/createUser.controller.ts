'use strict';
(function() {

  class CreateUserModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.user = {
        firstName: null,
        lastName: null,
        mobile: {
          phone: null
        }
      }
      this.$uibModalInstance = $uibModalInstance;
    }
    done(){
      this.$uibModalInstance.close(this.protocol)
    }
  }

  angular.module('riverApp')
    .controller('CreateUserModalController', CreateUserModalComponent);
})();
