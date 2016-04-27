'use strict';

angular.module('riverApp')
  .filter('responseExample', function () {
    return function (response) {
      if(response.type == 'entity'){
        return response.value;
      }
      if(response.type == 'number'){
        return Math.floor((response.max - response.min)/2) + response.min;
      }
      if(response.type == 'phrase' && response.phrases){
        return response.phrases[0];
      }
      if(response.type == 'unknown'){
        return '[unintelligible]';
      }
      return 'Error';
    };
  });
