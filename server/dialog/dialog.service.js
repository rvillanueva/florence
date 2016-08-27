'use strict';

var Promise = require('bluebird');
var ParserService = require('../components/parser');
var IntentService = require('../components/intent');
var ConditionService = require('../components/condition');
var User = require('../models/user/user.model');

export function classify(bot){
  return new Promise(function(resolve, reject){

    ParserService.classify(bot.message.text)
    .then(parsed => attachParsedtoBot(parsed))
    .catch(err => reject(err))

    function attachParsedToBot(){
      bot.parsed = parsed;
      resolve(bot);
    }
  })
}

export function handleSlotFilling(bot){
  return new Promise(function(resolve, reject){
    // if input matches valid response for last query, fill slot and get intent
    if(bot.state.askedParam){
      var query = {
        parsed: bot.parsed,
        param: bot.state.askedParam
      }
      ConditionService.fillSlot(query)
      .then(slot => {
        if(slot.status == 'filled'){
          bot.state.params[slot.param] = {
            value: slot.value
          }
          bot.intentKey = bot.state.intentKey
        }
        resolve(bot)
      })
      .catch(err => reject(err))
    }
  })
}


export function handleGivenIntent(bot){
  return new Promise(function(resolve, reject){

    // if no intent or no previous query, check for classified new intent

    if(!bot.intentKey && parsed.entities && parsed.entities.intent){
      bot.intentKey = parsed.entities.intent[0].value;    // This structure preserves the last intentKey in the saved state by design. May want to update state directly
    }
    resolve(bot)

  })
}

export function getIntent(bot){
  return new Promise(function(resolve, reject){
    IntentService.getByKey(bot.intentKey)
    .then(intent => {
      bot.intent = intent;
      resolve(bot);
    })
    .catch(err => reject(err))
  })
}


export function handleIntent(bot){
  return new Promise(function(resolve, reject){
    if(bot.intent){
      filterResponses(bot)
      .then(bot => handleFollowups(bot))
      .then(bot => handleResponseExecution(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })


  function filterResponses(bot){
    return new Promise(function(resolve, reject){
      if(bot.intent){
        // should evaluate each response by conditions and eliminate those that don't fit, leaving only those with missing params or matching
        bot.intent.responses = bot.intent.responses || [];

        var promises = [];
        bot.intent.responses.forEach(function(response, r){
          var conditionQuery = {
            response: response,
            params: bot.state.params
          }
          promises.push(evaluateResponse(conditionQuery))
        })

        bot.evaluatedResponses = {
          valid: [],
          incomplete: [],
          invalid: []
        }

        Promise.all(promises)
        .then(() => sortResponses())
        .then(() => resolve(bot))
        .catch(err => reject(err))

      } else {
        resolve(bot)
      }

      function evaluateResponse(query){
        return new Promise(function(resolve, reject){
          ConditionService.evaluateResponse(query)
          .then(evaluated => {
            if(evaluated.status === 'valid'){
              bot.evaluatedResponses.valid.push(evaluated)
            } else if(evaluated.status === 'incomplete') {
              bot.evaluatedResponses.incomplete.push(evaluated)
            } else {
              bot.evaluatedResponses.invalid.push(evaluated)
            }
            resolve(true)
          })
          .catch(err => reject(err))
        })
      }

      function sortValidResponses(){
        return new Promise(function(resolve, reject){
          // should sort valid responses by most specific
          bot.evaluatedResponses.valid.sort(function(a, b) {
              return parseFloat(a.price) - parseFloat(b.price);
          });
        })
      }

      function sortIncompleteResponses(){
        return new Promise(function(resolve, reject){
          // should sort incomplete responses by fewest missing params
          bot.evaluatedResponses.incomplete.sort(function(a, b) {
              return parseFloat(a.price) - parseFloat(b.price);
          });
        })
      }

    })
  }

  function handleFollowups(bot){
    return new Promise(function(resolve, reject){
      // should take the next "closest to match" response and ask for an outstanding parameter
      if(bot.evaluatedResponses.incomplete.length > 0){
        ConditionService.getQuestion(bot.evaluatedResponses.incomplete.missingParams[0])
        .then(question => {
          if(!question){
            reject(new Error('No question found for param ' + bot.evaluatedResponses.incomplete.missingParams[0].param));
            return null;
          } else {
            return ask(question)
          }
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      }

      function ask(question){
        bot.state.askedParam = question.param;
        return bot.send({
          text: question.text
        })
      }
    })
  }

  function selectResponse(bot){
    return new Promise(function(resolve, reject){
      if(bot.evaluatedResponses.valid.length > 0 && bot.evaluatedResponses.incomplete.length == 0){
        bot.response = bot.evaluatedResponses.valid[0].response;
      }
      resolve(bot)
    })
  }

  function handleResponseExecution(bot){
    return new Promise(function(resolve, reject){
      // if no unvalidated responses remain, execute the valid response that matches the most conditions.
      if(bot.response){
        executeResponse(bot.response)
      } else {
        resolve(bot)
      }

      function executeResponse(response){
        bot.state.askedParam = null;
        bot.send({
          text: response.text
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      }

    })
  }
}

export function handleExceptions(bot){
  return new Promise(function(resolve, reject){
    if(!bot.intent){
      bot.send({
        text: 'Uh oh, not sure I understood that. Can you try again?'
      })
      .then(() => resolve(bot))
      .catch(err => reject(err))

    } else if(!bot.response){
      bot.send({
        text: 'Sorry, looks like something went wrong. I let my team know and we\'ll fix it shortly!'
      })
      .then(() => resolve(bot))
      .catch(err => reject(err))

    } else {
      resolve(bot)
    }
  })
}


export function updateState(bot){
  return new Promise(function(resolve, reject){
    // should save state
    User.findById(bot.user._id)
    .then(user => {
      user.state = bot.state;
      return user.save()
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}
