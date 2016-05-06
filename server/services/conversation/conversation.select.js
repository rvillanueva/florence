'use strict';

var Parser = require('../interpreter');
var Conversation = require('../../api/conversation/conversation.service');

// Select refs

export function selectRef(bot) {
  return new Promise(function(resolve, reject) {
    filterRefsByCondition(bot)
      .then(refs => {
        if (bot.state.status == 'receiving') {
          return selectRefByIntent(bot, refs)
        } else {
          return selectRefToExecute(bot, refs)
        }
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}

// Filter out refs that don't match given conditions
function filterRefsByCondition(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Filtering refs...')
    var refs = [];
    if (bot.step) {
      refs = bot.step.next;
    }
    // build conditions TODO
    resolve(refs);
  })
}

function selectRefByIntent(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting refs by intent...');
    var matched = false;
    var fallback;
    // CHECK GLOBAL INTENTS
    // first check against global intents
    // If there's an urgent intent, use it
    // if there's a non-urgent intent, stash it as backup
    // Maybe check against local intents

    // CHECK AGAINST REF RULE MATCHES
    // match incoming message data to rule based NLP
    if (!matched && refs) {
      console.log('Checking ref matches...')
      for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        var isMatch = Parser.checkRefMatch(bot.message.text, ref)
        if (isMatch) {
          matched = ref;
        }
        if (ref.type == 'fallback') {
          fallback = ref;
        }
      }
    }

    if (!matched) {
      // TRY WIT
      // if nothing, try Wit
      // if it matches expected intent, use that
    }

    // IF NON-URGENT DIVERSION, USE IF NOTHING ELSE MATCHES

    // ELSE
    // use fallback if available

    // ELSE
    // return false

    //If diversion, build a ref
    if (bot.state.received.intent) {
      console.log('Returning conversation for intent ' + bot.state.received.intent)
      Conversation.getByIntent(bot.state.received.intent)
        .then(convo => {
          if (!convo) {
            reject('No convo found for intent.')
          }
          console.log('Returned conversation for intent.');
          bot.ref = {
            type: 'conversation',
            refId: convo._id
          };
          bot.conversation = convo;
          console.log('Returning bot for state change...');
          resolve(bot);
        })
        .catch(err => reject(err))
    } else {
      if (!matched && fallback) {
        bot.ref = fallback;
      } else {
        bot.ref = matched;
      }
      resolve(bot);
    }


  })

}

function selectRefToExecute(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting ref to execute...')
    var index = Math.floor(Math.random() * refs.length)
    if(refs[index]){
      bot.ref = refs[index];
      console.log('Ref chosen: ')
      console.log(bot.ref);
    }
      // CHOOSE REF BASED ON WEIGHT TODO
      // find non-intent && fallback refs
    resolve(bot)
  });
}



// NEXT CONVERSATION

export function next(bot) {
  // check fatigue
  // needs checkup?
  // check story items
  // check events/nudge
  // else play ending
}
