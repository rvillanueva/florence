'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');

export function hello(conversation, response){
  return {
    respond: () => {
      return startOnboard(conversation, response).init();
    },
    init: () => {
      // Generally won't fire
      conversation.say('Hello! This is a test welcome message.');
      return Measures.addScore(conversation, response).init({
        measure: 'mood'
      });
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
    respond: () => {

    },
    init: () => {
      conversation.say('Hey there! Looks like it\'s your first time talking to me.');
      conversation.say('My name\'s River, and I\'m designed to help you accomplish your wellness goals.');
      conversation.say('You can message me at any time and I can log your progress.');
      conversation.buttons('Interested?', [
        {
          type: 'postback',
          title: 'Sounds awesome.',
          payload: 0
        },
        {
          type: 'postback',
          title:'Not really...',
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
      conversation.say('Good to hear!');
      conversation.say('So, one thing I\'ve learned to track is your mood.');

      return Measures.addScore(conversation, response).init({
        measure: 'mood'
      });
    },
    init: () => {
    }
  }
}
