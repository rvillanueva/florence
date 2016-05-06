'use strict';

export function step(bot) {
  return new Promise(function(resolve, reject) {
    setStep(bot)
    .then(bot => {
      if (bot.state.status !== 'executing') {
        resolve(false);
      } else {
        executeStepByType(bot)
          .then(bot => resolve(bot))
          .catch(err => reject(err))
      }
    })

  })


  function setStep(bot){
    return new Promise(function(resolve, reject) {
      if(!bot.ref){
        reject('Error: No ref to execute.')
      }
      if (bot.ref.type == 'conversation'){
        bot.divert(bot.ref.refId)
        .then(bot => resolve(bot))
      } else if(bot.ref.type == 'step' || !bot.ref.type){
        bot.setStep(bot.ref.refId)
        .then(bot => resolve(bot))
      } else {
        reject('Bot ref type ' + bot.ref.type + 'unrecognized.')
      }

    })

  }

  function executeStepByType(bot) {
    console.log('Executing step with type ' + bot.step.type);
    var types = {
      say: () => {
        return bot.say(bot.step.text);
      },
      intent: () => {
        // Stash any entities identified from received message
      },
      buttons: () => {
        console.log('Do buttons here.')
      }
    }

    return new Promise(function(resolve, reject){
      if(!types[bot.step.type]){
        reject('Unknown step type.')
      }
      types[bot.step.type]();
      console.log('Doing step...')
      resolve(bot);
    })

  }

}
