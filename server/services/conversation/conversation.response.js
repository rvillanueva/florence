'use strict;'
var State = require('./conversation.state');

export function handle(bot, step){
  return new Promise(function(resolve, reject){
    var next = false;
    var foundPattern;
    console.log('Handling response...')
    step.paths.forEach(function(path, p){
      if(path.patterns){
        for (var i = 0; i < path.patterns.length; i++) {
          // check if button matches pathId
          var pattern = checkPattern(bot, path.patterns[i])
          if(pattern){
            foundPattern = pattern;
            next = path.next;
          }
        }
      }
    })
    console.log('FOUND PATTERN')
    console.log(foundPattern)
    if(foundPattern){
      bot.send(foundPattern.messages)
      bot.state.status = 'running';
    } else {
      bot.state.status = 'retrying';
    }
    State.setNextState(bot, next)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

export function checkPattern(bot, pattern) {
  if (pattern.type == 'exact' && pattern.phrases) {
    for (var i = 0; i < pattern.phrases.length; i++) {
      if (pattern.phrases[i] == bot.message.text) {
        return pattern;
      }
    }
  } else if (
    pattern.type == 'entity' &&
    bot.state.entities &&
    bot.state.entities[pattern.entity] &&
    (!pattern.value || bot.state.entities[pattern.entity][0].value == pattern.value)
  ) {
    return pattern;
  } else if (
    pattern.type == 'number' &&
    pattern.min >= bot.state.entities.number[0].value &&
    pattern.max <= bot.state.entities.number[0].value
  ){
    return pattern;
  } else {
    return false;
  }
}
