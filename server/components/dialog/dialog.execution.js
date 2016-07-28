'use strict';

var Promise = require('bluebird');

var taskRouter = {
  ask: handleQuestion,
  say: handleSpeech
}

// INPUT: received.text
// OUTPUT: received.entities, received.attributes
export function run(bot){
  return new Promise(function(resolve, reject){
    var text;
    var task = bot.loaded.task
    console.log('running')
    console.log(bot.loaded.task)
    if(!task){
      reject(new Error('No task provided to run.'));
    } else if(typeof taskRouter[task.type] === 'function'){
      taskRouter[task.type](bot)
      .then(bot => resolve(bot))
      .catch(err => reject(err))
    } else {
      reject(new Error('Unrecognized task type ' + ' for task '))
    }
  })
}

export function handleQuestion(bot){
  return new Promise(function(resolve, reject){
    var text = bot.loaded.task.text;
    text = replaceParams(text, bot.loaded.params);
    bot.loaded.text = text;
    bot.state.status = 'waiting';
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

export function handleSpeech(bot){
  return new Promise(function(resolve, reject){
    var text = bot.loaded.task.text;
    text = replaceParams(text, bot.loaded.params);
    bot.loaded.text = text;
    bot.send({
      text: text
    })
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}

function replaceParams(text, params){
  for(param in params){
    while(text.indexOf('<<' + param + '>>') > -1){
      var location = text.indexOf('<<' + param + '>>');
      var start = text.slice(0, location,(param.length + 4));
      var end = text.slice(4 + param.length, text.length);
      text = start + params[param] + end;
    }
  }
  return text;
}

/*
export function handleAction(bot){
  return new Promise(function(resolve, reject){
  })
}

export function handleEnd(bot){
  return new Promise(function(resolve, reject){
  })
}*/
