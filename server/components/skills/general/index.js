'use strict';
var Promise = require('bluebird');
var Messages = require('../../messages');

export function hello(conversation){
  var context = {
    intent: 'hello',
    needed: {
      entities: []
    }
  }
  return {
    context: context,
    respond: () => {

    },
    start: () => {
      return new Promise(function(resolve, reject){
        conversation.say('Hello! This is a test welcome message.');
        conversation.say('Would you like a chocolate?');
        resolve();
      })
    }
  }
}