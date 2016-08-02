'use strict';

var Promise = require('bluebird');
var Message = require('../message');
var Parser = require('../parser');
var DialogExecutionService = require('./dialog.execution');
var EntryService = require('../entry');

var maxLoops = 5;

export function handleExpectedResponse(bot) {
  console.log('Handling expected response...')
  var task = bot.loaded.task;
  var value = false;
  return new Promise(function(resolve, reject) {
    if (bot.state.status == 'waiting') {
      bot.state.status = 'responding';
      if (task.type == 'ask') {
        console.log('TASK IS:')
        console.log(task)
        parseResponse()
          .then(parsed => selectValidChoice(parsed))
          .then(choice => handleReplyToUser(choice))
          .then(choice => handleResponseStorage(choice))
          .then(completed => handleTodoCompletion(completed))
          .then(() => resolve(bot))
          .catch(err => reject(err))
      } else {
        bot.state.status = 'responding';
        console.log('Task not a question so ignoring user input...') // FIXME
        resolve(bot)
      }
    } else {
      resolve(bot)
    }
  })

  function parseResponse() {
    return new Promise(function(resolve, reject) {
      var query = {
        text: bot.received.content.text
      };
      Parser.classify(query)
        .then(parsed => resolve(parsed))
        .catch(err => reject(err))
    })
  }

  function selectValidChoice(parsed) {
    return new Promise(function(resolve, reject) {
      var selected = false;
      bot.loaded.task.choices.forEach(function(choice, c) {
        if(!selected){
          value = convertToValue(choice);
          if(value){
            selected = choice;
          }
        }
      })
      resolve(selected);
    })

    function convertToValue(choice) {
      if (choice.match.type == 'number') {
        return checkNumber(choice);
      } else if (choice.match.type == 'expression') {
        return checkExpression(choice);
      } else {
        return false;
      }
    }

    function checkNumber(choice) {
      var matched = false;
      var textToNum = Number(parsed._text);
      if(typeof textToNum == 'number' && isWithinChoiceRange(textToNum, choice.match)){
        matched = {
          number: textToNum
        }
      } else {
        parsed.entities.number = parsed.entities.number || []
        parsed.entities.number.forEach(function(number, n) {
          if(isWithinChoiceRange(number.value, choice.match)){
            matched = {
              number: number.value
            }
          }
        })
      }
      return matched;

      function isWithinChoiceRange(number, match){
        if ((typeof match.min == 'number' && number >= match.min) && (typeof match.max == 'number' && number <= match.max)) {
          return true;
        } else {
          return false;
        }
      }
    }

    function checkExpression(choice) {
      var matched = false;
      parsed.entities.expression = parsed.entities.expression || []
      parsed.entities.expression.forEach(function(expression, e) {
        if (expression.value == choice.match.expression) {
          matched = matched || {
            string: choice.match.expression
          };
        }
      })
      return matched;
    }
  }


  function handleReplyToUser(choice) {
    return new Promise(function(resolve, reject) {
      console.log('Handling reply to user from ')
      console.log(choice)
      if (choice && choice.responses && choice.responses.length > 0) {
        var sendable;
        sendable = choice.responses[Math.floor(Math.random() * choice.responses.length)]
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

  function handleResponseStorage(choice) {
    return new Promise(function(resolve, reject) {
      console.log('Storing response...')
      if (choice) {
        bot.loaded.task.content = bot.loaded.task.content || {};
        var entry = {
          userId: bot.user._id,
          meta: {
            taskId: bot.loaded.task._id,
            params: bot.loaded.params,
            prompt: bot.loaded.text,
          },
          value: value,
          response: {
            messageId: bot.received._id,
            content: bot.received.content
          }
        }
        EntryService.processNewEntry(entry)
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

export function handleNextTask(bot) {
  return new Promise(function(resolve, reject) {
    console.log('Handling next task...')
    if (bot.state.status == 'responding') {
      console.log('Loading next task')
      handleNoActiveTask()
        .then(() => handleEmptyQueue())
        .then(() => executeTask())
        .then(() => completeTodo(bot))
        .then(() => handleNextTask(bot))
        .then(() => resolve(bot))
        .catch(err => reject(err))
    } else {
      console.log('Ending response...')
      resolve(bot)
    }

    function handleNoActiveTask() {
      return new Promise((resolve, reject) => {
        if (!bot.loaded.task) {
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

    function completeTodo() {
      return new Promise((resolve, reject) => {
        if (bot.state.status == 'responding') {
          bot.completeTask()
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

    function executeTask() {
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
        params: {},
        immediate: true
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}
