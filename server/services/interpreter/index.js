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
        // Check if rules match
        var found = match(bot.message.text, intent);
        // If no rule matched, also check if the intent was returned from NLP
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

export function matchMetricInput(bot, metric){
  return new Promise(function(resolve, reject){
    var metric = bot.cache.metric;
    if(!metric){
      reject(new TypeError('No metric provided.'))
    } else {
      if (metric.data.type == 'numerical') {
        if(bot.cache.entities.number){

        }
      } else if (metric.data.type == 'categorical') {
        // search through
      } else if (metric.data.type == 'text') {
        resolve(bot.message.text);
      } else {
        reject(new TypeError('Unknown metric data type ' + metric.data.type));
      }
    }
  })
}
