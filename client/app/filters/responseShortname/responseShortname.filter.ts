'use strict';

angular.module('riverApp')
  .filter('responseShortname', function () {
    return function (response) {
      if(response.type == 'entity'){
        return response.value;
      }
      if(response.type == 'number'){
        return 'Number (' + response.min + ' - ' + response.max + ')';
      }
      if(response.type == 'phrase' && response.phrases){
        return response.phrases[0];
      }
      if(response.type == 'unknown'){
        return 'Unknown';
      }
      return 'Error'
    };
  });
