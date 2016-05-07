'use strict';

// CHOOSE THE NEXT BEST CONVERSATION TO HAVE

// check fatigue
// needs checkup?
// check story items
// check events/nudge
// else play ending

// Choose next conversation when there's no next step
export function conversation(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.step.id) {
      resolve(bot);
    } else if(bot.state.diverted){
      bot.setStep(bot.state.diverted[0].stepId)
      .then(bot => {
        resolve(bot);
      })
    } else {
      selectBest(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    }
  })
}

function selectBest(bot){
  return new Promise(function(resolve, reject) {
    if (!bot.state.variables.onboarded) {
      Conversation.getByIntent('intro')
        .then(convo => setConversation(bot, convo))
        .then(bot => resolve(bot))
        .catch(err => reject(err))
    } else {
      console.log('No good next conversation found.')
      resolve(bot);
    }
  })
}

function setConversation(bot, convo) {
  return new Promise(function(resolve, reject) {
    if (!convo) {
      reject('No conversation provided.')
    }
    bot.loaded.conversation = convo;
    bot.state.step.id = convo.next[0].refId;
  })
}
