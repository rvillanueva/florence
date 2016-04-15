'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Rules = require('./interpreter.rules');
var Context = require('../context');

function selectAction(intent, message, context){
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
}


export function getAction(message){
  return new Promise(function(resolve, reject){
    var context;
    Context.get(message.userId)
    .then(data => {
      context = data;
      Rules.checkRules(message, context)
    })
    .then(intent => {
      selectAction(intent, message, context)
    })
    .then(action => {
      console.log(action)
      resolve(action)
    })
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
