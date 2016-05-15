'use strict';
(function(){

class IntentsComponent {
  constructor(Intent) {
    this.intentService = Intent;
    this.intents = [];

    this.intentService.getAll()
      .then(intents => {
        this.intents = intents;
      })
  }
}

angular.module('riverApp')
  .component('intents', {
    templateUrl: 'app/routes/intents/intents.html',
    controller: IntentsComponent
  });

})();
