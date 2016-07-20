'use strict';

var Promise = require('bluebird');

export function searchPatterns(query){
  return new Promise(function(resolve, reject){
    console.log('searching with query:')
    console.log(query)
    var matched = [];
    query.patterns = query.patterns || [];
    query.patterns.forEach(function(pattern, p){
      // TODO implement other pattern types
      if(pattern.type == 'match'){
        if(checkMatch(query.text, pattern)){
          matched.push(pattern)
        }
      } else {
        console.log('Unrecognized pattern ' + pattern.type)
        reject(new Error('Pattern type ' + pattern.type + ' not recognized.'))
      }
    })

    resolve(matched);

  })


  function checkMatch(text, pattern){
      var rules = pattern.match.split('\n');
      for(var i = 0; i < rules.length; i++){
        var string = rules[i];
        // TODO Create custom REGEX
        if(text.toLowerCase() == string.toLowerCase()){
          return true;
        }
      }
      return false;
  }

}
