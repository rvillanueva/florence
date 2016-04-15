
var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Rules = require('./interpreter.rules');
var Context = require('../context');

/*
Action schema:





*/


export function getAction(message){
  return new Promise(function(resolve, reject){
    Context.get(message.userId)
    .then(context => Rules.getIntent(context, message))
    .then(intent => {
      return new Promise(function(resolve, reject){
        if(!intent){
          Interpret.getIntents(message, context)
          .then(intents => Interpret.chooseActionFromIntents(context, intents))
          .then(action => resolve(action))
          .catch(err => reject(err))
        } else {
          Interpret.chooseActionFromRule(context, intent)
          .then(action => resolve(action))
          .catch(err => reject(err))
        }
      })
    })
    .then(action => resolve(action))
    .catch(err => reject(err))
  });
}

/*
export function themes(message){
 // placeholder
}

export function tags(message){

}
*/
