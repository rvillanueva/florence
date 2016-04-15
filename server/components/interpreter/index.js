'use strict';

var Promise = require("bluebird");
var Interpret = require('./interpreter.service');
var Rules = require('./interpreter.rules');
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
      return Rules.checkRules(message, context)
    })
    .then(intent => {
      overrideIntent = intent;
      var skip = !!overrideIntent;
      return Interpret.getIntents(message, context, skip)
    })
    .then(intents => {
      return Interpret.chooseResponse(message, context, intents, overrideIntent)
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
