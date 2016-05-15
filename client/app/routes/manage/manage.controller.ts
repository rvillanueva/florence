'use strict';
(function(){

class ManageComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('riverApp')
  .component('manage', {
    templateUrl: 'app/routes/manage/manage.html',
    controller: ManageComponent
  });

})();
