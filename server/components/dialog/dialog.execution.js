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
  var loops = 0;
  for(var param in params){
    if (params.hasOwnProperty(param) && typeof params[param] == 'string') {
      while(text.indexOf('<<' + param + '>>') > -1 && loops < 5){
        var term = params[param];
        var location = text.indexOf('<<' + param + '>>');
        var start = text.slice(0, location);
        var end = text.slice((location + param.length + 4), text.length);
        var transformedTerm;

        // TODO - make generalizable framework to turn lowercase instead of manually defining params

        if(param == 'actionPhrase'){
          transformedTerm = uncapitalize(term);
        } else {
          transformedTerm = term;
        }
        text = start + transformedTerm + end;
        loops ++;
        if(loops == 5){
          // You screwed up
          console.log('ERROR: LOOPING TO REPLACE PARAMS OVERFLOWED FOR TERM ' + term)
        }
      }
    }
  }
  return text;
}

function uncapitalize(string){
  if(typeof string == 'string' && string.length > 0){
    var firstLetter = string.slice(0,1);
    var lastPart = string.slice(1,string.length);
    return firstLetter.toLowerCase() + lastPart;
  } else {
    return string;
  }
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
