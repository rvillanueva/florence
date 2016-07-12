'use strict';

var Promise = require('bluebird');

export function checkForPatterns(text, patterns){
  return new Promise(function(resolve, reject){
    patterns.forEach(function(pattern, p){
      // TODO implement other pattern types
      if(pattern.type == 'match'){
        if(checkMatch(text, pattern)){
          resolve(pattern);
        }
      } else {
        reject(new Error('Pattern type ' + pattern.type + ' not recognized.'))
      }
    })
  })


  function checkMatch(text, pattern){
      var rules = pattern.match.split('\n');
      var lowercased = text.toLowerCase();
      for(var i = 0; i < rules.length; i++){
        var string = rules[i];
        // TODO Create custom REGEX
        if(lowercased == string.toLowerCase()){
          return true;
        }
      }
      return false;
  }

}
