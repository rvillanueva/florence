'use strict';

export function step(bot){
  return new Promise(function(resolve, reject) {
    var step = bot.active.step;
    if(!step){
      resolve(false);
    }
    if(typeof stepFunctions[step.type] == 'function'){
      stepFunctions(bot, step)[step.type]()
      .then(() => resolve(bot))
    } else {
      reject('Step type ' + step.type + ' not recognized.')
    }
  })

  function stepFunctions(bot, step){
    return {
      say: () => {
        return bot.say(step.text);
      },
      intent: () => {
        // Stash any entities identified from received message
      },
      buttons: () => {
        console.log('Do buttons here.')
      }
    }
  }

}

function sendButtons(bot, step){
  var array = [];
  var message = {
    type: 'button',
    text: ' ',
    buttons: []
  }
  if(step.paths){
    step.paths.forEach(function(path, p){
      if(path.button && path.button.title){
        var button = {
          title: path.button.title,
          subtitle: path.button.subtitle,
          value: path._id
        }
        message.buttons.push(button)
      }
    })
    array.push(message);
    bot.send(array);
  }
}
