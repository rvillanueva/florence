// Asks for mood

var Mood = require('./mood')
var Triggers = require('../triggers')

export function addAspect(conversation, response) {
  // Need: aspectType
  // Optional: link

  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addScore(conversation, response) {
  // Need: aspectId
  return {
    respond: (params) => {
        if(!response.entities || !response.entities.score){
          conversation.say('Hey, sorry, don\'t think I understood that.');
          conversation.say('Do you mind rephrasing and trying again?');
          return conversation.expect({
            intent: 'addScore',
            needed: ['score']
          })
        }
        
        conversation.say('Got it, thanks.');
        return Entry.add({
          aspectId: params.aspectId,
          score: response.entities.score
        })

    },
    init: (params) => {
      conversation.say('Let\'s log your mood.');
      conversation.say('On a scale of one to ten, how would you rate your mood right now?');
      return conversation.expect({
        intent: 'addScore',
        needed: ['score']
      })
    },
  }
}

export function addTriggers(conversation, response) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addConfidence(conversation, response, params) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}

export function addPriority(conversation, response, params) {
  // Need aspectId
  return {
    respond: (params) => {
    },
    init: (params) => {
    },
  }
}
