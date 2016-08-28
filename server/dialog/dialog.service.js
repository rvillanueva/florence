'use strict';

var Promise = require('bluebird');
var ParserService = require('../components/parser');
var IntentService = require('../components/intent');
var ConditionService = require('../components/condition');
import User from '../models/user/user.model';

export function classify(bot){
  return new Promise(function(resolve, reject){

    var parserQuery = {
      text: bot.message.content.text
    }

    ParserService.classify(parserQuery)
    .then(parsed => attachParsedToBot(parsed))
    .catch(err => reject(err))

    function attachParsedToBot(parsed){
      bot.parsed = parsed;
      resolve(bot);
    }
  })
}

export function handleSlotFilling(bot){
  return new Promise(function(resolve, reject){
    // if input matches valid response for last query, fill slot and get intent
    if(bot.state.asked){
      var query = {
        parsed: bot.parsed,
        param: bot.state.asked
      }
      ConditionService.fillSlot(query)
      .then(slot => {
        if(slot.filled == true){
          bot.state.params[slot.param] = {
            value: slot.value
          }
        }
        resolve(bot)
      })
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })
}


export function handleGivenIntent(bot){
  return new Promise(function(resolve, reject){
    // if no intent or no previous query, check for classified new intent

    if(!bot.intentKey && bot.parsed.entities && bot.parsed.entities.intent){
      bot.state.intentKey = bot.parsed.entities.intent[0].value;
    }
    resolve(bot)

  })
}



export function handleIntent(bot){
  return new Promise(function(resolve, reject){
    if(bot.state.intentKey){
      getIntent(bot)
      .then(bot => filterResponses(bot))
      .then(bot => handleFollowups(bot))
      .then(bot => handleResponseExecution(bot))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      resolve(bot)
    }
  })

  function getIntent(bot){
    return new Promise(function(resolve, reject){
      IntentService.getByKey(bot.state.intentKey)
      .then(intent => {
        if(!intent){
          reject(new Error('No intent found with key ' + bot.state.intentKey))
        }
        bot.intent = intent;
        resolve(bot);
      })
      .catch(err => reject(err))
    })
  }



  function filterResponses(bot){
    return new Promise(function(resolve, reject){
      if(bot.intent){
        // should evaluate each response by conditions and eliminate those that don't fit, leaving only those with missing params or matching
        bot.intent.responses = bot.intent.responses || [];

        var promises = [];
        bot.intent.responses.forEach(function(response, r){
          var conditionQuery = {
            response: response,
            params: bot.state.params,
            user: bot.user
          }
          promises.push(evaluateResponse(conditionQuery))
        })

        bot.evaluatedResponses = {
          valid: [],
          incomplete: [],
          invalid: []
        }

        Promise.all(promises)
        .then(() => sortValidResponses())
        .then(() => sortIncompleteResponses())
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
              return parseFloat(a.specificity) - parseFloat(b.specificity);
          });
          resolve()
        })
      }

      function sortIncompleteResponses(){
        return new Promise(function(resolve, reject){
          // should sort incomplete responses by fewest missing params
          bot.evaluatedResponses.incomplete.sort(function(a, b) {
              return parseFloat(a.missingParams.length) - parseFloat(b.missingParams.length);
          });
          resolve();
        })
      }

    })
  }

  function handleFollowups(bot){
    return new Promise(function(resolve, reject){
      // should take the next "closest to match" response and ask for an outstanding parameter
      if(bot.evaluatedResponses.incomplete.length > 0){
        ConditionService.getQuestion(bot.evaluatedResponses.incomplete[0].missingParams[0].param)
        .then(question => {
          if(!question){
            reject(new Error('No question found for param ' + bot.evaluatedResponses.incomplete[0].missingParams[0].param));
            return null;
          } else {
            bot.state.asked = question.param;
            return ask(question)
          }
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      }

      function ask(question){
        bot.state.asked = question.param;
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
        bot.state.asked = null;
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
      user.stored = bot.stored;
      console.log(user.state)
      console.log(user.stored)
      return user.save()
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}
