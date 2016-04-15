'use strict';
var Promise = require('bluebird');
var Measures = require('../measures');

export function hello(conversation){
  return {
    respond: (entities) => {
      return new Promise(function(resolve, reject){
        if(entities.yesNo){

        }
      })
    },
    init: (entities) => {
      return new Promise(function(resolve, reject){
        conversation.say('Hello! This is a test welcome message.');
        Measures.logValue(conversation).init({
          measure: 'mood'
        });
      })
    }
  }
}
