// Asks for mood

var Mood = require('./mood')
var Triggers = require('../triggers')

export function logScore(conversation, response) {
  // save measure score

  return {
    respond: () => {
      // Route to correct measure
      /*if(!action.entities.measure){
        conversation.say('Sorry, got a bit lost. What change are you trying to track?');
        conversation.expect({
          intent: 'logValue',
          needed: ['measure']
        });
      } else {
        // Trigger next conversation
      }*/
      return Mood.logScore(conversation, response).respond();
    },
    init: () => {
      //ask for mood
      /*if(!action.entities.measure){
        conversation.say('What change would you like to keep track of?');
        conversation.expect({
          intent: 'logValue',
          needed: ['measure']
        });
      } else {
        // Route to correct question
      }*/
      return Mood.logScore(conversation, response).init();
    },
  }
}

export function logTriggers(conversation, response) {
  return {
    respond: () => {
      console.log('RESPONSE')
      console.log(response)
      return Mood.logTriggers(conversation, response).respond();
    },
    init: () => {
      return Mood.logTriggers(conversation, response).init();
    },
  }
}
