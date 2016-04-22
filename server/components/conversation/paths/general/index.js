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
          title: 'What can you do?',
          payload: {
            intent: 'explainSkills',
            buttonValue: 1
          }
        },
        {
          type: 'postback',
          title: 'Learning?',
          payload: {
            intent: 'startOnboard',
            buttonValue: 0
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
          conversation.say('Yup! I\'m still in the Bot Academy, so I haven\'t been certified to do everything quite yet. :)');
          conversation.say('But interacting with you will teach me some new things about how to talk to people.');
          explainSkills(conversation, response).init();
          resolve();
        } else {
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
      conversation.say('Even though I\'m still training, there are a few things I can do. Want to hear them?');
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
          conversation.say('Awesome!');
          return Measures.trackAspect(conversation, response).init();
        }
        if(!response.entities || response.entities.buttonValue !== 0){
        } else if (response.entities.buttonValue == 0){
          conversation.say('Okay, no problem! If there\'s anything you want me to help you track, feel free to type it in below!')
        }
        conversation.next();
        resolve();
      })
    }
  }
}
