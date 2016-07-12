'use strict';

var Promise = require('bluebird');
var Message = require('../message');
var DialogExecutionService = require('./dialog.execution');
var maxLoops = 5;

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function logMessage(bot) {
  return new Promise(function(resolve, reject) {
    Message.receive(bot.received)
      .then(() => resolve(bot))
      .catch(err => reject(err))
  })
}


export function handleExpectedResponse(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting') {
      bot.state.status = 'responding';
      Pattern.checkForExpected(text, patterns)
        .then(pattern => selectChoiceFromPattern(pattern))
        .then(choice => handleReplyToUser(pattern))
        .then(choice => handleResponseStorage(choice))
        .then(() => resolve(bot))
    } else {
      resolve(bot)
    }
  })

  function selectChoiceFromPattern(pattern) {
    return new Promise(function(resolve, reject) {
      if (pattern) {

      }
    })
  }

  function handleReplyToUser(choice) {
    return new Promise(function(resolve, reject) {
      if (choice) {
        bot.send({
          text: 'Got it.'
        })
        .then(() => resolve())
        .catch(err => reject(err))
      } else {
        resolve(false)
      }

    })
  }

  function handleResponseStorage(choice) {
    return new Promise(function(resolve, reject) {
      if (choice) {

      } else {
        resolve(false)
      }

    })
  }

}

export function handleNextStep(bot) {
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'ready') {
        handleTaskCompletion()
        .then(executeStep())
        .then(incrementStepIndex())
        .then(handleNextStep())
        .then(resolve(bot))
        .catch(err => reject(err))
    } else {
      resolve(bot)
    }

    function handleTaskCompletion() {
      if(bot.stepIndex > (bot.task.steps.length - 1){
        bot.completeTask(bot.task._id)
        .then(bot => bot.loadNextTask())
        .then(updatedBot => {
          bot = updatedBot;
          if(!bot.task){
            bot.state.status == 'waiting';
            bot.send({
              text: 'Done!'
            })
            .then(updatedBot => {
              bot = updatedBot;
              resolve(bot)
            })
            .catch(err => reject(err))
          } else {
            resolve(bot)
          }
        })
        .catch(err => reject(err))
      }
    }

    function executeStep() {
      return new Promise(function(resolve, reject) {
        DialogExecutionService.run(bot)
          .then(updatedBot => {
            bot = updatedBot;
            resolve()
          })
          .catch(err => reject(err))
      })

    }

    function incrementStepIndex(){
      bot.stepIndex ++;
    }

  })
}
