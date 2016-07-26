'use strict';

var actionIndex = {
  addUserToProgram: function(action) {
    return new Promise(function(resolve, reject) {
      // PARAMS
      // userId
      // programKey
    })
  },
  actOnTask: function(action) {
    return new Promise(function(resolve, reject) {
      // PARAMS
      // userId
      // programKey
    })
  },
}

export function execute(action) {
  if (typeof actionIndex[action.key] !== 'function') {
    reject(new Error('Unknown task key ' + action.key))
  }
  console.log('EXECUTING ACTION: ' + action.key);
  if(action.params){
    console.log('params:')
    console.log(action.params)
  }
  actionIndex[action.key](bot, action)
  .then(updatedBot => {
    bot = updatedBot;
    a++;
    executeUntilDone();
  })
  .catch(err => reject(err))
}
