'use strict';
(function(){

class VerifyComponent {
  constructor($stateParams) {
    this.vId = $stateParams.vId;
    this.token = $stateParams.token;
    this.entities = JSON.stringify({
      vId: this.vId,
      token: this.token
    })
    console.log(this.entities)
  }
}

angular.module('florenceApp')
  .component('verify', {
    templateUrl: 'app/routes/account/login/verify/verify.html',
    controller: VerifyComponent
  });

})();
