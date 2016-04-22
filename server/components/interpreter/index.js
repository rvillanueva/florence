'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Patterns = require('./interpreter.patterns');
var Context = require('../context');

export function getResponse(message){
  return new Promise(function(resolve, reject){
    var context;
    var intent;
    var overrideIntent;
    Context.get(message.userId)
    .then(data => {
      context = data;
      console.log('context')
      console.log(context);
      return Patterns.check(message, context)
    })
    .then(intent => {
      return new Promise((resolve, reject)=>{
        overrideIntent = intent;
        var skip = !!intent;
        Interpret.getIntents(message, context, skip)
        .then(intents => resolve(intents))
        .catch(err => resolve(err))
      })
    })
    .then(intents => {
      return new Promise((resolve, reject) => {
        Interpret.chooseResponse(message, context, intents, overrideIntent)
        .then(response => resolve(response))
        .catch(err => reject(err))
      })
    })
    .then(response => Interpret.convertButtonPayload(response))
    .then(response => Interpret.convertAspectKey(response))
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
