'use strict';

var Promise = require('bluebird');
var questions = require('./condition.questions');
var ConditionService = require('./condition.service');

export function evaluateResponse(query){
  // cycles through each condition in response and evalutes if fulfilled
  // if condition has incomplete data, push missing params
  return new Promise(function(resolve, reject){
    var promises = [];
    var responseEval = {
      status: 'valid',
      response: query.response || {},
      conditions: [],
      missingParams: []
    }
    if(evaluated.response.conditions){
      // FIXME needs to be by property
      evaluated.response.conditions.forEach(function(condition, c){
        promises.push(evaluateOneCondition(condition))
      })
    }
    resolve(evaluated)

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
      responseEval.conditions.push({
        name: condition.name,
        status: status
      })
    }

    function pushMissingParams(params){
      responseEval.missingParams = responseEval.missingParams.concat(params);
    }


  })

}

export function getQuestion(param){
  return new Promise(function(resolve, reject){
    var question = questions[param];
    if(question){
      question.param = param;
    }
    resolve(question);
  })
}

export function fillSlot(query){
  // expect parsed
  // should return slot status, param, and value
  return new Promise(function(resolve, reject){
    var res = {
      status: null,
      error: null,
      param: query.param,
      value: null
    }
    getQuestion(query.param)
    .then(question => {
      if(!question){
        reject(new Error('No question found for param ' + query.param));
      }
      return question.validate(query.parsed);
    })
    .then(data => {
      if(data && data.valid){
        res.status = 200;
        res.value = data.value;
      } else {
        res.status = 500;
        res.error = res.error;
      }
      resolve(res)
    })
    .catch(err => reject(err))
  })
}
