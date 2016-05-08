'use strict';

export function fire(bot) {
  return new Promise(function(resolve, reject) {
    console.log('\n\n\n\nRunning new step...')
    console.log(bot.loaded.step);
    executeStepByType(bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
  })

  function executeStepByType(bot) {
    console.log('Executing step with type ' + bot.loaded.step.type);
    var types = {
      say: () => {
        return bot.say(bot.loaded.step.text);
      },
      intent: () => {
        // Stash any entities identified from received message
      },
      buttons: () => {
        console.log('Do buttons here.')
      },
      fallback: () => {
        //do fallback stuff
      }
    }

    return new Promise(function(resolve, reject){
      if(!types[bot.loaded.step.type]){
        reject('Unknown step type.')
      }
      types[bot.loaded.step.type]();
      console.log('Doing step...')
      resolve(bot);
    })

  }

}
