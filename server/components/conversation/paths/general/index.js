'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');

export function hello(conversation){
  return {
    respond: (entities) => {
      conversation.say('Hey there!');
      return Measures.logScore(conversation).init({
        measure: 'mood'
      });
    },
    init: (entities) => {
      conversation.say('Hello! This is a test welcome message.');
      return Measures.logScore(conversation).init({
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
