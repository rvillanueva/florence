'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Rules = require('./interpreter.rules');
var Context = require('../context');

export function getResponse(message){
  return new Promise(function(resolve, reject){
    var context;
    var intent;
    Context.get(message.userId)
    .then(data => {
      context = data;
      console.log('context')
      console.log(context);
      return Rules.checkRules(message, context)
    })
    .then(override => {
      intent = override
        return Interpret.getIntents(message, context, intent)
    })
    .then(intents => {
        return Interpret.chooseResponse(context, intents)
    })
    .then(response => resolve(response))
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
