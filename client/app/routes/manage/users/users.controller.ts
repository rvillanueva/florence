'use strict';
(function(){

class UsersComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('riverApp')
  .component('users', {
    templateUrl: 'app/routes/manage/users/users.html',
    controller: UsersComponent
  });

})();
