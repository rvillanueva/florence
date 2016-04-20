'use strict';

angular.module('riverApp')
  .controller('OauthButtonsCtrl', function($window) {
    this.loginOauth = function(provider, state) {
      var url = '/auth/' + provider;
      if(state){
        url += '?state=' + JSON.stringify(state);
      }
      $window.location.href = url;
    };
  });
