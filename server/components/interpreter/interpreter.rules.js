'use strict';



// Custom intepreter to select intent and override wit

export function getIntent(message, context){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 // other commands will override
 return new Promise(function(resolve, reject){
   if(message.text === 'STOP'){
     resolve('unsubscribe');
   }

   if(context.intent == 'logTrigger'){
     context.entities.trigger = message.text;
     resolve('logTrigger');
   }

    resolve(false)
 })
}
