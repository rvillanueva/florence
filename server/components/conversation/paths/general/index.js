'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');

export function hello(conversation){
  return {
    respond: (entities) => {
        conversation.say('Hello! This is responding to your hello query.');
        conversation.say('You are a crazy person my friend.');
        return Measures.logScore(conversation).init({
          measure: 'mood'
        });
    },
    init: (entities) => {
      return new Promise(function(resolve, reject){
        conversation.say('Hello! This is a test welcome message.');
        Measures.logScore(conversation).init({
          measure: 'mood'
        });
      })
    }
  }
}
