'use strict';

var Promise = require("bluebird");
var Conversation = require('../../api/conversation/conversation.service');
var Interpret = require('./interpreter.service');
import Intent from '../../api/intent/intent.model';

export function checkSteps(bot, steps){
  //TODO Select by weight;
  var matched;
  var fallback;
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    var found = Interpret.checkIntentRules(bot.message.text, step)
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

export function match(text, intent){
  if(typeof intent.match == 'string' && typeof text == 'string'){
    var rules = intent.match.split('\n')
    var lowercased = text.toLowerCase();
    for(var i = 0; i < rules.length; i++){
      var string = rules[i];
      // TODO Create custom REGEX
      if(lowercased == string.toLowerCase()){
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
}

export function getIntents(text){
  return new Promise(function(resolve, reject){
    var returned = [];
    Intent.find({}).exec()
    .then(intents => {
      intents.forEach(function(intent, i){
        var found = match(text, intent);
        if(found){
          returned.push(intent);
        }
      })
      console.log(returned)
      resolve(returned);
    })
  })
  // return intent ids that match
  // get all intents that are relevant (global and match ids)
  // cycle through and match by rule first
  // then run through wit to see if there's a match by key
}
