var Wit = require('./wit');

export function getContext(user){
 // figure out the last query to user and expected intent
 if(user.expected && user.expected.intent){
   var context = {
     state: false,
     entities: false;
     timezone: false,
     location: false
   }
   return context;
 } else {
   return false;
 }

 //
}

export function intents(user, context){
 // if intent = trigger, skip Wit. otherwise, interpret it

 return new Promise(function(resolve, reject){
   Wit.intents(message, context)
   .then(intents => {resolve(intents)})
   .catch(err => {reject(err)})
 })
}
