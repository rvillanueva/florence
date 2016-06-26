'use strict';

var actionIndex = {
  introduceSelf: function(bot, action) {
    return new Promise(function(resolve, reject) {
      bot.state.stored.introduced = true;
      bot.bid({
        target: {
          objective: 'askForNewGoals',
        },
        modifier: 2
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    })
  },
  selectGreetingResponse: function(bot, action) {
    return new Promise(function(resolve, reject) {
      if (bot.state.stored.introduced) {
        bot.bid({
          target: {
            objective: 'askToHelp',
          },
          force: true
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      } else {
        resolve(bot)
      }
    })
  },
  forceNextTask: function(bot, action) {
    return new Promise(function(resolve, reject) {
      console.log('Forcing next task...')
      console.log(action.params);
      if (!action.params || !action.params.objective) {
        reject(new Error('Missing objective parameter in action'));
      }
      bot.bid({
        target: {
          objective: action.params.objective,
        },
        force: true
      })
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    })
  },
}

export function execute(bot) {
  return new Promise(function(resolve, reject) {
    var task = bot.cache.task;
    var a = 0;

    if (task.actions && task.actions.length > 0) {
      executeUntilDone(task.actions)
    } else {
      resolve(bot)
    }

    function executeUntilDone() {
      if (a < task.actions.length) {
        executeOne(task.actions[a])
      } else {
        console.log('Done executing.')
        resolve(bot)
      }
    }

    function executeOne(action) {
        if (typeof actionIndex[action.type] !== 'function') {
          reject(new Error('Unknown task type ' + action.type))
        }
        console.log('EXECUTING ACTION: ' + action.type);
        if(action.params){
          console.log('params:')
          console.log(action.params)
        }
        actionIndex[action.type](bot, action)
        .then(updatedBot => {
          bot = updatedBot;
          a++;
          executeUntilDone();
        })
        .catch(err => reject(err))
      }

  })
}
