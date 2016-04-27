'use strict';

angular.module('riverApp')
  .filter('responseShortname', function () {
    return function (response) {
      if(response.type == 'entity'){
        return 'Entity: ' + response.value;
      }
      if(response.type == 'number'){
        return 'Number: ' + response.min + ' - ' + response.max;
      }
      if(response.type == 'phrase' && response.phrases){
        return 'Match: ' + response.phrases[0];
      }
      if(response.type == 'unknown'){
        return 'Unknown';
      }
      return 'Error'
    };
  });
