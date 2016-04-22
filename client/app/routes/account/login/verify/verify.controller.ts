'use strict';
(function(){

class StartComponent {
  constructor() {
  }
}

angular.module('riverApp')
  .component('verify', {
    templateUrl: 'app/routes/account/login/verify/verify.html',
    controller: VerifyComponent
  });

})();
