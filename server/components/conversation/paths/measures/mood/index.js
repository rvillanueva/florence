var Measures = require('../../measures');

export function logScore(conversation, response) {
  return {
    respond: () => {
        conversation.say('Great, thanks!')
        return logTriggers(conversation, response).init();

      /*Entry.log({
        measure: 'mood',
        value: action.entities.value
      })*/
    },
    init: (entities) => {
      conversation.say('On a scale of 1 (the worst) to 10 (the best), how are you feeling right now?')
      return conversation.expect({
        intent:'logScore',
        entities: {
          measure: 'mood'
        },
        expected:['number']
      })
    }
  }
}

export function logTriggers(conversation, response) {
  return {
    respond: () => {
      console.log('Received response of: ')
      console.log(response)
      if(!response || !response.message || !response.message.text){
        conversation.say('Uh oh, I\'m afraid I didn\'t understand that one. Was there message text?');
        return conversation.expect({
          intent:'logTriggers',
          entities: {
            measure: 'mood'
          },
          needed: ['text']
        })
      } else {
        /*Entry.log({
          measure: 'mood',
          triggers: entities.text
        });*/
        conversation.say('SYSTEM: Echoing: ')
        conversation.say(response.message.text)
        conversation.say('Great! That\'s all I have for now – stay tuned!');
        return conversation.next();
      }
    },
    init: () => {
      conversation.say('Has there been anything that\'s been making you feel better or worse?');
      conversation.say('(If you want, you can use #hashtags to keep track of specific things over time.)');
      return conversation.expect({
        intent:'logTriggers',
        entities: {
          measure: 'mood'
        },
        needed: ['text']
      })
    },
  }
}
