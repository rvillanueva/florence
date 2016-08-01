'use strict';
(function(){

class ProfileComponent {
  constructor($stateParams, $http) {
    this.$http = $http;
    this.userId = $stateParams.id;
    if(!this.userId){
      this.userId = 'me';
    }
    this.aspectMap = {};
    this.getProfile(this.userId);
    this.getEntries(this.userId);
    this.getAspectMap();
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

  getAspectMap(){
    this.$http.get('api/aspects')
    .then(res => {
      this.aspects = res.data;
      angular.forEach(this.aspects, (aspect, a) => {
        var metricMap = {};
        this.aspectMap[aspect.key] = aspect;
        angular.forEach(aspect.metrics, (metric, m) => {
          metricMap[metric.metric] = metric;
        })
        this.aspectMap[aspect.key].metrics = metricMap;
      })
      console.log(this.aspectMap);
    })
    .catch(err => {
      console.log(err)
    })
  }

}

angular.module('florenceApp')
  .component('profile', {
    templateUrl: 'app/routes/profile/profile.html',
    controller: ProfileComponent
  });

})();
