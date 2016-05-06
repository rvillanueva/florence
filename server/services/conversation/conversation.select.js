'use strict';

var Parser = require('../interpreter');
var Conversation = require('../../api/conversation/conversation.service');

// Select refs

export function selectRef(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting ref...')
    filterRefsByCondition(bot)
      .then(refs => selectRefByStatus(bot, refs))
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

function selectRefByStatus(bot, refs) {
  return new Promise(function(resolve, reject) {
      var intents = [];
      var executables = [];
      for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        // TODO need to handle non-intent and non-executable
        if (ref.type == 'intent') {
          intents.push(ref)
        } else {
          executables.push(ref)
        }
      }
      setStatus(bot, intents, executables)
      .then(bot => {
        console.log('Selecting ref based on status ' + bot.state.status + '...')
        if (bot.state.status == 'receiving') {
          selectRefByIntent(bot, intents)
            .then(bot => resolve(bot))
        } else if (bot.state.status == 'executing'){
          selectRefToExecute(bot, executables)
            .then(bot => resolve(bot))
        } else {
          bot.ref = null;
          resolve(bot)
        }
      })
  })

}

function setStatus(bot, intents, executables){
  return new Promise(function(resolve, reject) {
    console.log('Setting status...')
    if(bot.state.status == 'receiving'){
      resolve(bot);
    } else {
      if (executables.length > 0) {
        bot.state.status = 'executing';
      } else if (intents.length > 0) {
        bot.state.status = 'waiting';
      } else {
        bot.state.status = 'done';
      }
      resolve(bot);
    }
  })
}

function selectRefByIntent(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting refs by intent...');
    var matched = false;
    var fallback;

    // CHECK AGAINST REF RULE MATCHES
    // match incoming message data to rule based NLP
    if (!matched && refs) {
      console.log('Checking ref matches...')
      matched = Parser.checkRefs(bot, ref)
    }

    // CHECK INTENT

    // ELSE
    // use fallback if available

    // ELSE
    // return false

    //If diversion, build a ref
    if (bot.state.received.intent) {
      console.log('Returning conversation for intent ' + bot.state.received.intent)
      Diversion.divertByIntent(bot)
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    } else {
      if (matched) {
        bot.ref = matched;
        bot.state.status = 'executing';
      } else {
        bot.ref = false;
        bot.say('Sorry, I didn\'t quite understand that... can you try again?') // Need to handle confusion better;
        bot.state.status = 'waiting';
      }
      resolve(bot);
    }


  })

}

function selectRefToExecute(bot, refs) {
  return new Promise(function(resolve, reject) {
    console.log('Selecting ref to execute...');
    var index = Math.floor(Math.random() * refs.length)
      // CHOOSE REF BASED ON WEIGHT TODO;
    bot.ref = refs[index];
    resolve(bot);
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
