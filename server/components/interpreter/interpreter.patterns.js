'use strict';

// Custom intepreter to select intent and override wit

export function check(response){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 // other commands will override
 return new Promise(function(resolve, reject){
   if(response.message && response.message.text && typeof response.message.text == 'string'){
     text = message.text.toLowerCase();
   }
   if(text == 'stop'){
     response.intent = 'stop';
   }

   if(
     text == 'hello'
     || text == 'hi'
     || text == 'hey'
     || text == 'yo'
    ){
     response.intent = 'hello';
   }

   if(text == 'login'){
     response.intent = 'login';
   }
    resolve(response);
 })
}
