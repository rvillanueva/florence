'use strict';
(function(){

class UsersComponent {
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    setTimeout(() => {
      console.log(this.users)
    }, 1000)
  }
}

angular.module('riverApp')
  .component('users', {
    templateUrl: 'app/routes/manage/users/users.html',
    controller: UsersComponent
  });

})();
