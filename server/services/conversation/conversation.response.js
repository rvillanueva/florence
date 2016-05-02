'use strict;'
var State = require('./conversation.state');

export function handle(bot, step){
  return new Promise(function(resolve, reject){
    console.log('Handling response...');
    var next = false;
    var foundPattern;
    var data = checkEachPattern(bot, step);
    next = data.next;
    if(data.messages){
      console.log('FOUND PATTERN')
      console.log(data.pattern)
      bot.send(data.messages)
      bot.state.status = 'running';
    } else {
      bot.state.status = 'retrying';
    }
    State.setNextState(bot, next)
    .then(bot => resolve(bot))
    .catch(err => reject(err))
  })
}

function checkEachPattern(bot, step){
  var data = {};
  step.paths.forEach(function(path, p){
    var buttonMatches;
    bot.state.entities = bot.state.entities || {};
    // Handle button logic
    if(path._id == bot.state.entities.button){
      buttonMatches = true;
      data.messages = path.button.messages;
      data.next = path.next;
    } else if(path.patterns){

      // Check patterns
      for (var i = 0; i < path.patterns.length; i++) {
        // check if button matches pathId
        var patternMatches = checkPattern(bot, path.patterns[i])
        if(patternMatches){
          data.messages = patternMatches.messages;
          data.next = path.next;
        }
      }
    }
  })
  return data;

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
  }  else {
    return false;
  }
}
