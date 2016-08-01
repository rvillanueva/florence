'use strict';

angular.module('florenceApp')
  .filter('choicePattern', function () {
    return function (pattern) {
      if(pattern.type == 'integer'){
        if(pattern.min && pattern.max){
          return 'An integer from '+ pattern.min + ' to ' + pattern.max;
        } else if (typeof pattern.min == 'number'){
          return 'An integer of at least '+ pattern.min;
        } else if (typeof pattern.max == 'number'){
          return 'An integer no higher than '+ pattern.max;
        }
        return 'Any integer'
      }
      if(pattern.type == 'expression'){
        if(pattern.expression && pattern.expression.name){
          return 'An expression equivalent to ' + pattern.expression.name;
        }
      }
      if(pattern.type == 'match'){
        if(pattern.matches && pattern.matches.length > 0){
          var resp = 'A response that exactly matches ' + pattern.matches[0].term;
          if(pattern.matches.length > 1){
            resp += ' or ' + pattern.matches.length + ' other term'
            if(pattern.matches.length > 2){
              resp += 's'
            }
          }
          return resp;
        }
      }
      return 'Error';
    };
  });
