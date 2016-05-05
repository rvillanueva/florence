'use strict';

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
  var refs = [];
  refs = bot.active.step.next;
  // build conditions TODO
  resolve(refs)
}

function selectRefByIntent(bot, refs){
  // CHECK GLOBAL INTENTS
  // first check against urgent diversions
  // if there's a non-urgent diversion, stash it

  // CHECK AGAINST REF RULE MATCHES
 // match incoming message data to rule based NLP

 // TRY WIT
 // if nothing, try Wit
 // if it matches expected intent, use that


 // IF NON-URGENT DIVERSION, USE IF NOTHING ELSE MATCHES

 // ELSE
 // use fallback if available

 // ELSE
 // return false

}

function selectRefToExecute(bot, refs){
  // CHOOSE REF BASED ON WEIGHT TODO
  return refs[Math.floor(Math.random() * refs.length)];
}



// NEXT CONVERSATION

export function next(bot){
  // check fatigue
  // needs checkup?
  // check story items
  // check events/nudge
  // else play ending
}
