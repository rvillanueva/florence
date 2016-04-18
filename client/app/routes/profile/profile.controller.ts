'use strict';
(function(){

class ProfileComponent {
  constructor($stateParams, $http) {
    this.message = 'Hello';
    this.$http = $http;
    this.userId = $stateParams.id;
    if(this.userId){
      this.getProfile(this.userId);
      this.getEntries(this.userId);
    }
  }
  getProfile(userId){
    console.log(userId);
    this.$http.get('api/users/' + userId)
    .then(res => {
      this.user = res.data;
      if(!this.user){
        console.log('No user');
      }
      console.log(this.user)
    })
    .catch(err => {
      console.log(err)
    })
  }
  getEntries(userId){
    this.$http.get('api/entries/user/' + userId)
    .then(res => {
      this.entries = res.data;
      if(!this.entries){
        console.log('No entries');
      }
      console.log(this.entries)
    })
    .catch(err => {
      console.log(err)
    })
  }

}

angular.module('riverApp')
  .component('profile', {
    templateUrl: 'app/routes/profile/profile.html',
    controller: ProfileComponent
  });

})();
