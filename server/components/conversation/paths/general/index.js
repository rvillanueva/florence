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
      conversation.say('Oh, hey there!');
      conversation.say('I\'m River, and I\'m learning to be a personal care companion.');
      conversation.buttons(' ', [
        {
          type: 'postback',
          title: 'Still learning?',
          payload: {
            intent: 'startOnboard',
            buttonValue: 0
          }
        },
        {
          type: 'postback',
          title: 'What can you do?',
          payload: {
            intent: 'explainSkills',
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
          conversation.say('Yup! I\'m still in school, so I haven\'t been certified to do everything quite yet.');
          conversation.say('But hopefully interacting with you will teach me some new things about how to talk to people.');
          explainSkills(conversation, response).init();
          resolve();
        }
      })
    },
  }
}

export function explainSkills(conversation, response){
  return {
    init: () => {
      conversation.say('There are a few things I can help you out with now. Want to hear them?');
      conversation.buttons(' ', [
        {
          type: 'postback',
          title: 'Sure',
          payload: {
            intent: 'explainSkills',
            buttonValue: 1
          }
        },
        {
          type: 'postback',
          title: 'Nope.',
          payload: {
            intent: 'explainSkills',
            buttonValue: 0
          }
        }
      ])
      return conversation.expect({
        intent: 'explainSkills'
      });
    },
    respond: () => {
      return new Promise((resolve, reject) => {
        if(response.entities.buttonValue == 1){
          conversation.say('Great!');
        }
        if(!response.entities || response.entities.buttonValue !== 0){
          conversation.say('Here are some of the things I can help you with. Let me know if you\'re interested in any of them!');
          Aspects.getOutcomes()
          .then(aspects => {
            Measures.addScore(conversation, response).init({
              aspectId: aspects[0]._id
            });
          })
        } else if (response.entities.buttonValue == 0){
          conversation.say('Okay, no problem! If there\'s anything you want me to help you track, feel free to type it in below!')
        }
        resolve();
      })
    }
  }
}
