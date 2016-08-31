'use strict';

var Promise = require('bluebird');

var conditions = {
  hasInsurance: function(query){
    return new Promise(function(resolve, reject){
      var res = {
        status: null,
        missingParams: []
      }
      if(!query.user.stored.insuranceCarrier){
        query.user.state.params = query.user.state.params || {};
        res.missingParams.push({
          param: 'insuranceCarrier'
        })
      }
      if(!query.user.stored.policyNumber){
        res.missingParams.push({
          param: 'policyNumber'
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
      if(!query.user.stored.birthdate){
        res.missingParams.push({
          param: 'birthdate'
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
    query.user = query.user.toObject();
    query.user.stored = query.user.stored || {};
    var name = query.condition.name || null;
    if(typeof conditions[name] === 'function'){
      conditions[name](query)
      .then(res => resolve(res))
      .catch(err => reject(err))
    } else {
      reject(new Error('No condition checking function with name ' + query.condition.name + ' could be found.'))
    }
  })
}
