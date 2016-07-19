'use strict';

var Promise = require('bluebird');
var Message = require('../message');
var Parser = require('../parser');
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
  var step = bot.task.steps[bot.stepIndex];
  var choice = false;
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting') {
      bot.state.status = 'responding';
      if(step.type == 'question'){
        checkChoiceMatch()
          .then(handleReplyToUser(choice))
          .then(handleResponseStorage(choice))
          .then(() => resolve(bot))
      } else {
        console.log('ERROR: Waiting step is not a question. Resetting active state.');
        bot.state.active = {
          taskId: null,
          stepId: null
        }
        resolve(bot)
      }
    } else {
      resolve(bot)
    }
  })

  function checkChoiceMatch() {
    return new Promise(function(resolve, reject) {
      setupPatternArray()
      .then(patterns => Parser.checkForPatterns(bot.received.text, patterns))
      .then(pattern => resolveAssociatedChoice(pattern))
      .catch(err => reject(err))
    })

    function setupPatternArray(){
      return new Promise(function(resolve, reject){
        var patterns = [];
        step.choices.forEach(function(choice, c){
          var pushed = choice.pattern;
          pushed.choiceId = choice._id;
          patterns.push(pushed);
        })
        resolve(patterns);
      })
    }

    function resolveAssociatedChoice(pattern){
      var found = false;
      step.choices.forEach(function(stepChoice, s){
        if(!found && pattern.choiceId == choice._id){
          choice = stepChoice;
          resolve();
        }
      })
      resolve()
    }
  }

  function handleReplyToUser() {
    return new Promise(function(resolve, reject) {
      if (choice) {
        bot.send({
          text: 'Got it.'
        })
        .then(() => resolve())
        .catch(err => reject(err))
      } else {
        bot.send({
          text: 'Sorry, I didn\'t quite get that. Can you try again?'
        })
        .then(() => resolve())
        .catch(err => reject(err))
      }

    })
  }

  function handleResponseStorage(choice) {
    return new Promise(function(resolve, reject) {
      if (choice) {
        // TODO Build response storage
        resolve(false)
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

    function handleTaskCompletion(){
      return new Promise(function(resolve, reject){
        if(bot.stepIndex > (bot.task.steps.length - 1)){
          bot.completeTask(bot.task._id)
          .then(bot => bot.loadNextTask())
          .then(updatedBot => {
            bot = updatedBot;
            return handleEmptyQueue()
          })
          .then(() => resolve())
          .catch(err => reject(err))
        } else {
          resolve()
        }
      })
    }

    function handleEmptyQueue(){
      return new Promise(function(resolve, reject){
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
      return new Promise(function(resolve, reject) {
        bot.stepIndex ++;
        resolve()
      })
    }

  })
}

export function handleNotification(bot){
  return new Promise(function(resolve, reject) {
    bot.state.active = {
      taskId: '5786a2dc517d5513c018c9e0'
    }
    executeStep(bot)
    .then(bot => bot.update())
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
