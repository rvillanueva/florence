var Wit = require('./wit');

export function getContext(user){
 // figure out the last query to user and expected intent
 if(user.expected && user.expected.intent){
   return user.expected.intent;
 } else {
   return false;
 }
}

export function intents(user, context){
 // if context = trigger log, skip Wit. otherwise, interpret it

 return new Promise(function(resolve, reject){
   Wit.intents(message, context)
   .then(intents => {resolve(intents)})
   .catch(err => {reject(err)})
 })
}
