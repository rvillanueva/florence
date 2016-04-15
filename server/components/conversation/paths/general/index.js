'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');

export function hello(conversation, response){
  return {
    respond: () => {
      conversation.say('Hey there!');
      return Measures.logScore(conversation, response).init({
        measure: 'mood'
      });
    },
    init: () => {
      conversation.say('Hello! This is a test welcome message.');
      return Measures.logScore(conversation, response).init({
        measure: 'mood'
      });
    }
  }
}

export function unsubscribe(conversation){
  return {
    respond: (entities) => {

    },
    init: (entities) => {

    }
  }
}
