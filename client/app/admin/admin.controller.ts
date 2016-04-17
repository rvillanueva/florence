'use strict';

(function() {

class AdminController {
  constructor(User) {
    // Use the User $resource to fetch all users
    this.users = User.query();
    setTimeout(() => {
      console.log(this.users)
    }, 1000)
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
}

angular.module('riverApp.admin')
  .controller('AdminController', AdminController);

})();
