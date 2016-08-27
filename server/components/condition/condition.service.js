'use strict';

var Promise = require('bluebird');

var conditions = {
  hasInsurance: function(query){
    return new Promise(function(resolve, reject){
      var res = {
        status: null,
        missingParams: []
      }
      if(!query.user.stored.birthdate){
        res.missingParams.push({
          param: 'birthdate'
        })
      }
      if(!query.user.stored.firstName){
        res.missingParams.push({
          param: 'firstName'
        })
      }
      if(!query.user.stored.lastName){
        res.missingParams.push({
          param: 'lastName'
        })
      }
      if(!query.user.stored.policyNumber){
        res.missingParams.push({
          param: 'policyNumber'
        })
      }
      if(!query.user.stored.insuranceCarrier){
        res.missingParams.push({
          param: 'insuranceCarrier'
        })
      }
      if(res.missingParams.length > 0){
        res.status = 'incomplete';
      } else {
        res.status = 'valid';
      }
      resolve(res);
    })
  }
}

export function evaluateOne(query){
  return new Promise(function(resolve, reject){
    query.condition = query.condition || {};
    query.condition.name = query.condition.name || {};
    if(typeof conditions[query.condition.name] === 'function'){
      conditions[query.condition.name](query)
      .then(res => resolve(res))
      .catch(err => reject(err))
    } else {
      reject(new Error('No condition checking function with name ' + query.condition.name + ' could be found.'))
    }
  })
}
