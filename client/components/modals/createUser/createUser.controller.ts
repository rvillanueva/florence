'use strict';
(function() {

  class CreateUserModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.saving = false;
      this.user = {
        identity: {
          firstName: null,
          lastName: null,
          email: null,
          mobile: null,
        }
      }

      this.$uibModalInstance = $uibModalInstance;

    }
    submit(form){
      this.saving = true;
      console.log(form)

      this.submitted = true;
      if (form.$valid) {
        this.$http.post('/api/users', this.user).success(user => {
          this.$uibModalInstance.close(user)
        })
        .error(err => {
          this.errors = {};

          // Update validity of form fields that match the sequelize errors
          if (err.name && err.errors) {
            angular.forEach(err.errors, (error, field) => {
              if(err.errors.hasOwnProperty(field)){
                form[field].$setValidity('mongoose', false);
                this.errors[field] = error.message;
              }
            });
          }
          console.log(this.errors)
        });
      }
    }
  }

  angular.module('florenceApp')
    .controller('CreateUserModalController', CreateUserModalComponent);
})();
