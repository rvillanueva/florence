// Asks for mood

var Mood = require('./mood')
var Triggers = require('../triggers')

export function logValue(conversation) {
  // save measure score

  return {
    respond: (entities) => {
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
      Mood.respond(entities);
    },
    init: (entities) => {
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
      Mood.init(entities);
    },
  }
}

export function logTrigger(entities) {
  return {
    respond: (entities) => {
      Mood.logTriggers().respond(entities);
    },
    init: (entities) => {
      Mood.logTriggers().init(entities);
    },
  }
}
