'use strict';

(function() {

class MainController {

  constructor() {
  }
}

angular.module('riverApp')
  .component('main', {
    templateUrl: 'app/routes/main/main.html',
    controller: MainController
  });

})();