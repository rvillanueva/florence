'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Rules = require('./interpreter.rules');
var Context = require('../context');

export function getResponse(message){
  return new Promise(function(resolve, reject){
    var context;
    Context.get(message.userId)
    .then(data => {
      context = data;
      Rules.checkRules(message, context)
    })
    .then(intent => {
      return new Promise(function(resolve, reject){
        Interpret.getIntents(message, context, intent)
          .then(response => resolve(response))
          .catch(err => reject(err))
      })
    })
    .then(intents => {
      return new Promise(function(resolve, reject){
        console.log('intents:')
        console.log(intents);
        Interpret.chooseResponse(context, intents)
          .then(response => resolve(response))
          .catch(err => reject(err))
      })
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
