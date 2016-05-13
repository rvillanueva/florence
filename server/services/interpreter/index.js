'use strict';

var Promise = require("bluebird");
var Wit = require('./wit')
import Intent from '../../api/intent/intent.model'

export function getIntents(bot){
  return new Promise(function(resolve, reject){
    var returned = [];
    Intent.find({}).exec()
    .then(intents => {
      intents.forEach(function(intent, i){
        var found = match(bot.message.text, intent);
        if(!found){
          bot.state.entities.intents.forEach(function(parsed, p){
            if(parsed == intent.key){
              found = true;
            }
          })
        }
        if(found){
          returned.push(intent);
        }
      })
      bot.cache.intents = returned;
      console.log(bot.state.entities)
      console.log(bot.cache.intents);
      resolve(bot);
    })
  })
  // return intent ids that match
  // get all intents that are relevant (global and match ids)
  // cycle through and match by rule first
  // then run through wit to see if there's a match by key
}

// Match against given rules
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

export function getEntities(bot){
  return new Promise(function(resolve, reject){
      Wit.getEntities(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}
