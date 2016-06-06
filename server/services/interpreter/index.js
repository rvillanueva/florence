'use strict';

var Promise = require("bluebird");
var Wit = require('./wit')
import Intent from '../../api/intent/intent.model';

export function getIntents(bot){
  return new Promise(function(resolve, reject){
    var returned = [];
    Intent.find({}).exec()
    .then(intents => {
      intents.forEach(function(intent, i){
        // Check if rules match
        var found = match(bot.message.text, intent);
        // If no rule matched, also check if the intent was returned from NLP
        if(!found && bot.state.entities.intent){
          bot.state.entities.intent.forEach(function(parsed, p){
            if(parsed.value == intent.key){
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

export function getMeasurementValue(bot){
  return new Promise(function(resolve, reject){
    var metric = bot.cache.metric;
    console.log(metric);
    if(!metric || !metric.validation){
      reject(new TypeError('No valid metric provided.'))
    } else if (metric.validation.type == 'number') {
      if(bot.cache.entities.number && bot.cache.entities.number.length > 0){
        var number = bot.cache.entities.number[0].value;
        if(metric.validation.min && number < metric.validation.min){
          number = false;
        }
        if(metric.validation.max && number > metric.validation.max){
          number = false;
        }
        resolve(number);
      } else {
        resolve(false)
      }
    } else if (metric.validation.type == 'category') {
      // search through
      resolve(false)
    } else if (metric.validation.type == 'text') {
      resolve(bot.message.text);
    } else {
      console.log('Unknown metric data type ' + metric.data.type)
      reject(new TypeError('Unknown metric data type ' + metric.data.type));
    }
  })
}
