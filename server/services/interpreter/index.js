'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Patterns = require('./interpreter.patterns');
var Conversation = require('../../api/conversation/conversation.service');

export function getEntities(bot){
  return new Promise(function(resolve, reject){
    Patterns.check(bot)
    .then(bot => Interpret.getEntities(bot))
    .then(bot => Interpret.mergeEntities(bot))
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  });
}

export function checkSteps(bot, steps){
  //TODO Select by weight;
  console.log('Checking steps:')
  console.log(steps);
  var matched;
  var fallback;
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    var found = check(bot.message.text, step)
    if (found) {
      matched = step;
    }
    if (step.type == 'fallback') {
      fallback = step;
    }
  }

  // TRY WIT
  // if nothing, try Wit
  // if it matches expected intent, use that

console.log(matched)
console.log(fallback);
  if (matched) {
    return matched;
  } else if (fallback) {
    return fallback;
  } else {
    return false;
  }
  // Split by line
  // check for match by line
}

function check(text, step){
  if(step.type == 'intent' && typeof step.match == 'string' && typeof text == 'string'){
    var rules = step.match.split('\n')
    var lowercased = text.toLowerCase();
    console.log(rules);
    for(var i = 0; i < rules.length; i++){
      var string = rules[i];
      // Create custom REGEX
      if(lowercased == string.toLowerCase()){
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}

export function matchGlobalIntents(bot){
  return new Promise(function(resolve, reject){
    Conversation.getByIntent('intro')
    .then(convo => resolve(convo))
    .catch(err => reject(err))
    //resolve(false);
  });
}
