'use strict';

var Promise = require('bluebird');
var ConditionQuestionService = require('./condition.questions');
var ConditionService = require('./condition.service');

export function evaluateResponse(query){
  // cycles through each condition in response and evalutes if fulfilled
  // if condition has incomplete data, push missing params
  return new Promise(function(resolve, reject){
    var promises = [];
    var responseEval = {
      status: 'valid',
      response: query.response || {},
      conditions: {},
      specificity: 0,
      missingParams: []
    }
    var conditions = responseEval.response.conditions;

    if(conditions){
      // FIXME needs to be by property
      for (var condition in conditions) {
          if (conditions.hasOwnProperty(condition)) {
            promises.push(evaluateOneCondition({
              name: condition,
              value: conditions[condition]
            }))
          }
      }
    }

    Promise.all(promises)
    .then(() => calculateSpecificity())
    .then(() => resolve(responseEval))
    .catch(err => reject(err))

    function evaluateOneCondition(condition){
      return new Promise(function(resolve, reject){
        var conditionQuery = {
          condition: condition,
          params: query.params,
          user: query.user
        }
        ConditionService.evaluateOne(conditionQuery)
        .then(evaluation => {
          updateStatus(evaluation.status);
          pushCondition(condition, evaluation.status);
          pushMissingParams(evaluation.missingParams);
          resolve()
        })
        .catch(err => reject(err))
      })
    }

    function updateStatus(status){
      if(status == 'incomplete' && responseEval.status !== 'invalid'){
        responseEval.status = 'incomplete'
      } else if(status == 'invalid'){
        responseEval.status = 'invalid'
      }
    }

    function pushCondition(condition, status){
      responseEval.conditions[condition.name] = status;
    }

    function pushMissingParams(params){
      responseEval.missingParams = responseEval.missingParams.concat(params);
    }

    function calculateSpecificity(){
      return new Promise(function(resolve, reject){
        if(responseEval.status == 'valid'){
          responseEval.specificity = Object.keys(responseEval.conditions).length
        }
        resolve()
      })
    }


  })

}

export function getQuestion(param){
  return new Promise(function(resolve, reject){
    ConditionQuestionService.get(param)
    .then(question => {
      if(question){
        question.param = param;
      }
      resolve(question);
    })
  })
}

export function fillSlot(query){
  // expect parsed
  // should return slot status, param, and value
  return new Promise(function(resolve, reject){
    var res = {
      filled: null,
      error: null,
      param: query.param,
      value: null
    }
    getQuestion(query.param)
    .then(question => handleValidation(question))
    .then(validationRes => updateResponse(validationRes))
    .then(() => resolve(res))
    .catch(err => reject(err))

    function handleValidation(question){
      if(!question){
        reject(new Error('No question found for param ' + query.param));
      }
      return question.validate(query.parsed);
    }

    function updateResponse(validationRes){
      return new Promise(function(resolve, reject){
        if(validationRes && validationRes.valid == true){
          res.filled = true;
          res.value = data.value;
        } else {
          res.filled = false;
          res.error = res.error;
        }
        resolve()
      })
    }
  })
}
