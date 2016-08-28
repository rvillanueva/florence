'use strict';

var Promise = require('bluebird');

var questions = {
  firstName: {
    text: 'What\'s your first name?',
    validate: function(parsed){
      return new Promise(function(resolve, reject){
        resolve({
          valid: true,
          value: parsed._text
        });
      }) // do you need a promise here?
    }
  },
  lastName: {
    text: 'What\'s your last name?',
    validate: function(parsed){
      return new Promise(function(resolve, reject){
        resolve({
          valid: true,
          value: parsed._text
        });
      })
    }
  },
  birthdate: {
    text: 'What\'s your birthdate?',
    validate: function(parsed){
      return new Promise(function(resolve, reject){
        var res = {
          valid: null,
          reason: null,
          value: null
        };
        if(parsed && parsed.entities && parsed.entities['datetime'] && parsed.entities['datetime'][0].value){
          res.valid = true;
          res.value = parsed.entities['datetime'][0].value;
        } else {
          res.valid = false;
          res.reason = 'Entity ' + param + 'not found in parsed data.';
        }
        resolve(res);
      })

    }
  },
  policyNumber: {
    text: 'What\'s policy number? (This is the long number on your health insurance card.)',
    validate: function(parsed){
      return new Promise(function(resolve, reject){
        // need to have custom policy validation -- number of digits etc
        resolve({
          valid: true,
          value: parsed._text
        });
      })
    }
  },
  insuranceCarrier: {
    text: 'Who is your health insurance carrier? (Examples: Aetna, Blue Cross Blue Shield, or Medicare. This should be the company on your health insurance card.)',
    validate: function(parsed){
      return new Promise(function(resolve, reject){
        var res = {
          valid: null,
          error: null
        };
        if(parsed && parsed.results && parsed.results['insuranceCarrier'] && parsed.results['insuranceCarrier'][0].value){
          res.valid = true;
          res.value = parsed.results['insuranceCarrier'][0].value;
        } else {
          res.valid = false;
          res.error = 'Entity ' + param + 'not found in parsed data.';
        }
        resolve(res);
      })
    }
  }
};

export function get(param){
  return new Promise(function(resolve, reject){
    if(typeof questions[param] == 'object'){
      resolve(questions[param]);
    } else {
      resolve(false);
    }
  })
}
