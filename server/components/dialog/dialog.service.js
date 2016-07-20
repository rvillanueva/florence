'use strict';

var Promise = require('bluebird');
var Message = require('../message');
var Parser = require('../parser');
var DialogExecutionService = require('./dialog.execution');
var maxLoops = 5;

export function handleExpectedResponse(bot) {
  var step = bot.task.steps[bot.stepIndex];
  var choice = false;
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting') {
      bot.state.status = 'responding';
      if(step.type == 'question'){
        matchChoiceToInput()
          .then(choice => handleReplyToUser(choice))
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

  function matchChoiceToInput() {
    return new Promise(function(resolve, reject) {
      setupPatternQuery()
      .then(query => Parser.searchPatterns(query))
      .then(matches => resolveAssociatedChoice(matches))
      .catch(err => reject(err))
    })

    function setupPatternQuery(){
      return new Promise(function(resolve, reject){
        var query = {
          text: bot.received.text,
          patterns: []
        }
        step.choices.forEach(function(choice, c){
          choice.patterns.forEach(function(pattern, p){
            pattern = pattern.toObject();
            pattern.meta = {
              choice: choice
            }
            query.patterns.push(pattern);
          })
        })
        resolve(query);
      })
    }

    function resolveAssociatedChoice(matches){
      return new Promise(function(resolve, reject){
        if(matches.length > 0){
          resolve(matches[0].meta.choice);
        } else {
          resolve(false);
        }
      })
    }
  }

  function handleReplyToUser(choice) {
    return new Promise(function(resolve, reject) {
      if (choice) {
        bot.send({
          text: 'Got it.'
        })
        .then(() => resolve(choice))
        .catch(err => reject(err))
      } else {
        bot.send({
          text: 'Sorry, I didn\'t quite get that. Can you try again?'
        })
        .then(() => resolve(choice))
        .catch(err => reject(err))
      }

    })
  }

  function handleResponseStorage(choice) {
    return new Promise(function(resolve, reject) {
      if (choice) {
        // TODO Build response storage
        resolve(true)
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
        .then(handleNextStep(bot))
        .then(bot => resolve(bot))
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
    }



    function executeStep() {
      return new Promise(function(resolve, reject) {
        if(bot.state.status == 'responding'){
          DialogExecutionService.run(bot)
            .then(updatedBot => {
              bot = updatedBot;
              resolve()
            })
            .catch(err => reject(err))
        } else {
          resolve()
        }
      })

    }

    function incrementStepIndex(){
      return new Promise(function(resolve, reject) {
        if(bot.state.status == 'responding'){
          bot.stepIndex ++;
        }
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
