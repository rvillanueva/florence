'use strict';
(function(){

class StartComponent {
  constructor() {
  }
}

angular.module('riverApp')
  .component('start', {
    templateUrl: 'app/routes/account/login/start/start.html',
    controller: StartComponent
  });

})();
