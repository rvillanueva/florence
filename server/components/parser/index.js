'use strict';

var Promise = require('bluebird');
var Wit = require('./wit');

export function classify(query){
  return new Promise(function(resolve, reject){
    // should return a list of best matches for expression and intents
    /*var sampleRes = {
      text: 'test',
      entities: {
        numbers: [{
          value: 5,
          confidence: 1
        }],
        datetime: [{
          value: {
            from: new Date(),
            to: new Date()
          },
          confidence: 1
        }],
        expression: [{
          value: 'no',
          confidence: 1
        }]
      }
    }*/
    Wit.classify(query.text)
    .then(res => resolve(res))
    .catch(err => reject(err))
  })
}
