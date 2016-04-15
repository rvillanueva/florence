'use strict';



// Custom intepreter to select intent and override wit

export function checkRules(message, context){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 // other commands will override
 return new Promise(function(resolve, reject){
   var text;
   if(message.text && typeof message.text == 'string'){
     text = message.text.toLowercase();
   }
   if(text == 'stop'){
     resolve('unsubscribe');
   }

   if(text == 'hello' || text == 'hi' || text == 'hey'){
     resolve('hello');
   }

   if(context.intent == 'logTrigger'){
     resolve('logTrigger');
   }
    resolve(false)
 })
}
