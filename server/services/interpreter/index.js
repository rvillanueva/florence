'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Patterns = require('./interpreter.patterns');

export function getEntities(bot){
  return new Promise(function(resolve, reject){
    Patterns.check(bot)
    .then(bot => Interpret.getEntities(bot))
    .then(bot => Interpret.mergeEntities(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  });
}

export function checkRefMatch(text, ref){
  var found = false;
  if(ref.type == 'match' && typeof ref.match == 'string'){
    var rules = ref.match.split('\n')
    for(var i = 0; i < rules.length; i++){
      var string = rules[i];
      // Create custom REGEX
      if(text == string){
        return true;
      }
    }
    if(!found){
      return false;
    }
  } else {
    return false;
  }
  // Split by line
  // check for match by line
}
