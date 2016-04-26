'use strict';
(function(){

class ScriptsComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('riverApp')
  .component('scripts', {
    templateUrl: 'app/routes/scripts/scripts.html',
    controller: ScriptsComponent
  });

})();
