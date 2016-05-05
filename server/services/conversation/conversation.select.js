'use strict';

var Parser = require('../interpreter');

// Select refs

export function selectRef(bot){
  filterRefsByCondition(bot)
  .then(refs => {
    if(bot.state.status == 'receiving'){
      return selectRefByIntent(bot, refs)
    } else {
      return selectRefToExecute(bot, refs)
    }
  })
  .then(ref => resolve(ref))
}

// Filter out refs that don't match given conditions
function filterRefsByCondition(bot){
  return new Promise(function(resolve, reject){
    var refs = [];
    refs = bot.active.step.next;
    // build conditions TODO
    resolve(refs)
  })
}

function selectRefByIntent(bot, refs){
  return new Promise(function(resolve, reject){
    var matched = false;
    var fallback;
    // CHECK GLOBAL INTENTS
    // first check against global intents
    // If there's an urgent intent, use it
    // if there's a non-urgent intent, stash it as backup
    // Maybe check against local intents

    // CHECK AGAINST REF RULE MATCHES
   // match incoming message data to rule based NLP
   if(!matched){
     for (var i = 0; i < refs.length; i++){
       var ref = refs[i];
       var isMatch = Parser.checkRefMatch(bot.message.text, ref)
       if(isMatch){
         matched = ref;
       }
       if(ref.type == 'fallback'){
         fallback = ref;
       }
     }
   }

   if(!matched){
     // TRY WIT
     // if nothing, try Wit
     // if it matches expected intent, use that
   }

   // IF NON-URGENT DIVERSION, USE IF NOTHING ELSE MATCHES

   // ELSE
   // use fallback if available

   // ELSE
   // return false
   if(!matched && fallback){
     resolve(fallback);
   } else {
     resolve(matched);
   }
  })

}

function selectRefToExecute(bot, refs){
  return new Promise(function(resolve, reject){
    // CHOOSE REF BASED ON WEIGHT TODO
    // find non-intent && fallback refs
    resolve(refs[Math.floor(Math.random() * refs.length)])
  });
}



// NEXT CONVERSATION

export function next(bot){
  // check fatigue
  // needs checkup?
  // check story items
  // check events/nudge
  // else play ending
}
