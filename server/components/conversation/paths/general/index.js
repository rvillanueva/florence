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
    respond: (params) => {

    },
    init: (params) => {
      conversation.say('Hey there!');
      conversation.say('My name\'s River, and I\'m designed to help you accomplish your wellness goals.');
      conversation.say('What do you think?');
      conversation.buttons('', [
        {
          type: 'postback',
          title: 'Sounds awesome.',
          payload: 0
        },
        {
          type: 'postback',
          title:'Eh...',
          payload: 1
        }
      ])
      return conversation.expect({
        intent: 'onboardStep2'
      });
    }
  }
}

export function onboardStep2(conversation, response){
  return {
    respond: () => {
      return new Promise((resolve, reject) => {
        conversation.say('Good to hear!');
        conversation.say('So, one thing I\'ve learned to track is your mood.');
        Aspects.getOutcomes()
        .then(aspects => {
          Measures.addScore(conversation, response).init({
            aspectId: aspects[0]._id
          });
        })
        .catch(err => reject(err))
      })
    },
    init: () => {
    }
  }
}
