'use strict';

angular.module('florenceApp')
  .filter('responseExample', function () {
    return function (pattern) {
      if(pattern.type == 'entity'){
        return pattern.value;
      }
      if(pattern.type == 'number'){
        return Math.floor((pattern.max - pattern.min)/2) + pattern.min;
      }
      if(pattern.type == 'exact' && pattern.phrases){
        return pattern.phrases[0];
      }
      if(pattern.type == 'unknown'){
        return '[unintelligible]';
      }
      return 'Error';
    };
  });
