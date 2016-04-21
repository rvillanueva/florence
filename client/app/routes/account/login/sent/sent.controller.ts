'use strict';
(function(){

class SentComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('riverApp')
  .component('sent', {
    templateUrl: 'app/routes/account/login/sent/sent.html',
    controller: SentComponent
  });

})();
