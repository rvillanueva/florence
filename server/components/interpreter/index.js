
var Promise = require("bluebird");
var Interpret = require('./interpreter.service');

/*
Action schema:





*/


export function intents(user, message){
  return new Promise(function(resolve, reject){
    Interpret.getContext(user)
    .then(context => Interpret.intents(message, context))
    .then(intents => Interpret.intentsToAction(intents))
    .then(action => resolve(action))
    .catch(err => {reject(err)})
  });
}

/*
export function themes(message){
 // placeholder
}

export function tags(message){

}
*/
