'use strict';

// Custom intepreter to select intent and override wit

export function check(bot){
 // if intent = trigger, skip Wit. otherwise, interpret intent & actions
 // other commands will override
 return new Promise(function(resolve, reject){
   var text;
   if(bot.message && bot.message.text && typeof bot.message.text == 'string'){
     text = bot.message.text.toLowerCase();
   }
   if(text == 'stop'){
     bot.state.intent = 'stop';
   }

   if(
     text == 'hello'
     || text == 'hi'
     || text == 'hey'
     || text == 'yo'
    ){
      console.log('intent set')
     bot.state.intent = 'hello';
   }

   if(text == 'login'){
     bot.state.intent = 'login';
   }
   console.log('botting')
   console.log(bot.state.intent)
    resolve(bot);
 })
}
