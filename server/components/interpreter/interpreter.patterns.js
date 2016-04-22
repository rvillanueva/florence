'use strict';

// Custom intepreter to select intent and override wit

export function check(message, context){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 // other commands will override
 return new Promise(function(resolve, reject){
   var text;
   if(message.text && typeof message.text == 'string'){
     text = message.text.toLowerCase();
   }
   if(text == 'stop'){
     resolve({
       intent: 'stop'
     });
   }

   if(
     text == 'hello'
     || text == 'hi'
     || text == 'hey'
     || text == 'yo'
    ){
     resolve({
       intent: 'hello'
     });
   }

   if(text == 'login'){
     resolve({
       intent: 'login'
     });
   }

   if(context.intent == 'addTriggers'){
     resolve({
       intent:'addTriggers'
     });
   }
    resolve(false)
 })
}
