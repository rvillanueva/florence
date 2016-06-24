'use strict';

var actionIndex = {
  introduceSelf: function(bot, action) {
    return new Promise(function(resolve, reject) {
      bot.state.stored.introduced = true;
      resolve(bot);
    })
  },
  selectGreetingResponse: function(bot, action) {
    return new Promise(function(resolve, reject) {
      if (!bot.state.stored.introduced) {
        bot.bid({
          objective: 'askForNewGoals',
          modifier: 2
        }))
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      } else {
        bot.bid({
          target: {
            objective: 'askToHelp',
          },
          force: true
        })
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      }
    })
  },
  forceNextTask: function(bot, action) {
    return new Promise(function(resolve, reject) {
      if(!action.params || !action.params.objective){
        reject('Missing objective parameter in action');
      }
      bot.bid({
        target: {
          objective: bot.action.params.objective,
        },
        force: true
      }))
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    })
  },
}

export function execute(bot) {
  return new Promise(function(resolve, reject) {
      var task = bot.cache.task;
      var a = 0;

      if(task.actions && task.actions.length > 0){
        executeOne(actions[a])
        .then(bot => resolve(bot))
        .catch(err => reject(err))
      } else {
        resolve(bot)
      }

      function executeOne(action) {
        return new Promise(function(resolve, reject) {
          if (typeof actions[action.type] !== 'function') {
            reject('Unknown task type ' + task.action.type)
          }
          actionIndex[task.action.type](bot, action)
            .then(bot => {
              a++
              if(a < bot.actions.length){
                return executeOne(actions[a])
              } else {
                resolve(bot)
              }
            })
            .catch(err => reject(err))
        })
    }

  })
}
