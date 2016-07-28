'use strict';

var Promise = require('bluebird');
var Message = require('../message');
var Parser = require('../parser');
var DialogExecutionService = require('./dialog.execution');
var maxLoops = 5;

export function handleExpectedResponse(bot) {
  console.log('Handling expected response...')
  var step = bot.loaded.step;
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting') {
      bot.state.status = 'responding';
      if (step.type == 'question') {
        console.log('STEP IS:')
        console.log(step)
        matchChoiceToInput()
          .then(choice => handleReplyToUser(choice))
          .then(choice => convertChoiceToValue(choice))
          .then(value => handleResponseStorage(value))
          .then(completed => handleTodoCompletion(completed))
          .then(() => resolve(bot))
          .catch(err => reject(err))
      } else {
        bot.state.status = 'responding';
        console.log('Step not a question so ignoring user input...') // FIXME
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
        .then(value => resolve(value))
        .catch(err => reject(err))
    })

    function setupPatternQuery() {
      return new Promise(function(resolve, reject) {
        console.log('setting up pattern query')

        var query = {
          text: bot.received.text,
          patterns: []
        }
        step.choices = step.choices || [];
        step.choices.forEach(function(choice, c) {
          choice.patterns.forEach(function(pattern, p) {
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

    function resolveAssociatedChoice(matches) {
      return new Promise(function(resolve, reject) {
        console.log('resolving matches from')
        console.log(matches)
        if (matches.length > 0) {
          resolve(matches[0].meta.choice);
        } else {
          resolve(false);
        }
      })
    }

    function convertChoiceToValue(choice) {
      return new Promise(function(resolve, reject) {
        var value;
        if(choice.type == 'number'){
          value = {
            number: 0
          }
        }
        if (true) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    }
  }

  function handleReplyToUser(choice) {
    return new Promise(function(resolve, reject) {
      console.log('Handling reply to user from ')
      console.log(choice)
      choice = true;
      if (choice) {
        var sendable = {
          text: 'Got it.'
        };
        bot.send(sendable)
          .then(() => resolve(choice))
          .catch(err => reject(err))
      } else {
        bot.state.status = 'waiting';
        bot.send({
            text: 'Sorry, I didn\'t quite get that. Can you try again?'
          })
          .then(() => resolve(choice))
          .catch(err => reject(err))
      }

    })
  }

  function handleResponseStorage(value) {
    return new Promise(function(resolve, reject) {
      console.log('Storing response...')
      if (value) {
        var response = {
          userId: bot.user._id,
          value: value,
          question: {
            questionId: step.question._id,
            text: step.question.text
          },
          response: {
            messageId: bot.received._id,
            text: bot.received.text
          }
        }
        ResponseService.create(response)
        .then(() => resolve(true))
        .catch(err => reject(err))
      } else {
        resolve(false)
      }

    })
  }

  function handleTodoCompletion(completed) {
    return new Promise(function(resolve, reject) {
      console.log('Removing task from queue...')
      if (completed) {
        bot.completeTask()
        .then(updated => {
          bot = updated
          resolve()
        })
        .catch(err => reject(err))
      } else {
        resolve()
      }

    })
  }

}

export function handleNextStep(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Handling next step...')
    if (bot.state.status == 'responding') {
      console.log('Loading next step')
      handleNoActiveTask()
        .then(() => handleEmptyQueue())
        .then(() => executeStep())
        .then(() => loadNextStep())
        .then(() => handleNextStep(bot))
        .then(() => resolve(bot))
        .catch(err => reject(err))
    } else {
      console.log('Ending response...')
      resolve(bot)
    }
    function handleNoActiveTask() {
      return new Promise((resolve, reject) => {
        if(!bot.loaded.task){
          bot.loadNextTask()
            .then(updated => {
              bot = updated;
              resolve()
            })
            .catch(err => reject(err))
        } else {
          resolve()
        }
      })

    }

    function loadNextStep() {
      return new Promise((resolve, reject) => {
        if(bot.state.status == 'responding'){
          bot.loadNextStep()
            .then(updated => {
              bot = updated;
              resolve()
            })
            .catch(err => reject(err))
        } else {
          resolve()
        }
      })

    }

    function handleEmptyQueue() {
      return new Promise(function(resolve, reject) {
        console.log('handling empty queue')
        if (!bot.loaded.task) {
          bot.state.status = 'waiting';
          bot.send({
            text: 'Done!'
          })
          .then(() => resolve())
          .catch(err => reject(err))
        } else {
          resolve()
        }
      })
    }

    function executeStep() {
      return new Promise(function(resolve, reject) {
        console.log('executing step')
        if (bot.state.status == 'responding') {
          DialogExecutionService.run(bot)
            .then(updated => {
              bot = updated;
              resolve()
            })
            .catch(err => reject(err))
        } else {
          resolve()
        }
      })

    }

  })
}

export function handleNotification(bot) {
  return new Promise(function(resolve, reject) {
    var taskId = '5786a2dc517d5513c018c9e0';
    bot.state.status = 'responding';
    bot.state.active = {
      taskId: taskId
    }
    bot.addTodo({
      taskId: taskId,
      immediate: true
    })
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}
