'use strict';

// CHOOSE THE NEXT BEST CONVERSATION TO HAVE

// check fatigue
// needs checkup?
// check story items
// check events/nudge
// else play ending


export function setNext(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.step.id){
      resolve(bot);
    }
    if(!bot.state.variables.onboarded){
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

function setConversation(bot, convo){
  return new Promise(function(resolve, reject){
    if(!convo){
      reject('No conversation provided.')
    }
    bot.conversation = convo;
    bot.state.step.id = convo.next[0].refId;
  })
}
