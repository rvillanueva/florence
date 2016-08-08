'use strict';

angular.module('florenceApp')
  .filter('fromNow', function () {
    return function (input) {
      if(input){
        return moment(input).fromNow();
      } else {
        return null;
      }
    };
  });
