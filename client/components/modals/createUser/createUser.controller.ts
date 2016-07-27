'use strict';
(function() {

  class CreateUserModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.saving = false;
      this.user = {
        firstName: null,
        lastName: null,
        email: null,
        mobile: null,
      }
      this.$uibModalInstance = $uibModalInstance;
    }
    done(){
      this.saving = true;
      this.$http.post('/api/users', this.user).success(user => {
        this.$uibModalInstance.close(user)
      })
      .error(err => {
        this.saving = false;
        window.alert(err);
        console.log(err)
      })
    }
  }

  angular.module('riverApp')
    .controller('CreateUserModalController', CreateUserModalComponent);
})();
