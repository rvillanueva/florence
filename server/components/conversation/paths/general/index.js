'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');
var Aspects = require('../../../aspects');

export function hello(conversation, response){
  return {
    respond: (params) => {
      return startOnboard(conversation, response).init();
    },
    init: (params) => {
      // Generally won't fire
      return new Promise((resolve, reject) => {
        conversation.say('Hello! This is a test welcome message.');
        Aspects.getOutcomes()
        .then(aspects => {
          Measures.addScore(conversation, response).init({
            aspectId: aspects[0]._id
          });
        })
        .catch(err => reject(err))
      })
    }
  }
}

export function unsubscribe(conversation, response){
  return {
    respond: () => {

    },
    init: () => {

    }
  }
}

export function startOnboard(conversation, response){
  return {
    init: (params) => {
      conversation.say('Hey there!');
      conversation.say('My name\'s River, and I can help you track your wellness goals.');
      conversation.buttons('What do you think?', [
        {
          type: 'postback',
          title: 'Sounds awesome!',
          payload: {
            intent: 'startOnboard',
            buttonValue: 0
          }
        },
        {
          type: 'postback',
          title: 'Eh...',
          payload: {
            intent: 'startOnboard',
            entities: null,
            buttonValue: 1
          }
        }
      ])
      return conversation.expect({
        intent: 'startOnboard'
      });
    },
    respond: (params) => {
      return new Promise((resolve, reject) => {
        if(response.entities.buttonValue == 0){
          conversation.say('Good to hear!');
        }
        if(response.entities.buttonValue == 1){
          conversation.say('Come on, you can do it!');
        }
        conversation.say('One thing I\'ve learned to track is your mood.');
        Aspects.getOutcomes()
        .then(aspects => {
          Measures.addScore(conversation, response).init({
            aspectId: aspects[0]._id
          });
        })
        .catch(err => reject(err))
      })
    },
  }
}

export function chooseOutcome(conversation, response){
  return {
    init: () => {
    },
    respond: () => {

    }
  }
}
