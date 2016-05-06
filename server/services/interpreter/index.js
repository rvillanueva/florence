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

export function checkRefsMatch(bot, refs){
  //TODO Select by weight;
  var matched;
  var fallback;
  for (var i = 0; i < refs.length; i++) {
    var ref = refs[i];
    var found = check(bot.message.text, ref)
    if (found) {
      matched = ref;
    }
    if (ref.type == 'fallback') {
      fallback = ref;
    }
  }

  // TRY WIT
  // if nothing, try Wit
  // if it matches expected intent, use that


  if (matched.length > 0) {
    return matched;
  } else if (fallback.length > 0) {
    return fallback;
  } else {
    return false;
  }
  // Split by line
  // check for match by line
}

function check(text, ref){
  if(ref.type == 'match' && typeof ref.match == 'string'){
    var rules = ref.match.split('\n')
    console.log(rules);
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
}
