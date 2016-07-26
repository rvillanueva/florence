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
          .then(choice => handleResponseStorage(choice))
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
        .then(choice => resolve(choice))
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

  function handleResponseStorage(choice) {
    return new Promise(function(resolve, reject) {
      console.log('Storing response...')
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
    console.log('Handling next step...')
    if (bot.state.status == 'responding') {
      console.log('Loading next step')
      loadNextStep()
        .then(() => handleEmptyQueue())
        .then(() => executeStep())
        .then(() => handleNextStep(bot))
        .then(() => resolve(bot))
        .catch(err => reject(err))
    } else {
      console.log('Ending response...')
      resolve(bot)
    }

    function loadNextStep() {
      return new Promise((resolve, reject) => {
        bot.loadNextStep()
          .then(updated => {
            bot = updated;
            resolve()
          })
          .catch(err => reject(err))
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
    bot.state.status = 'responding';
    bot.queue.splice(0,0, {
      taskId: '5786a2dc517d5513c018c9e0'
    })
    console.log('Popping notification task')
    console.log('Queue is now...')
    console.log(bot.queue)
      handleNextStep(bot)
      .then(bot => bot.update())
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })
}
