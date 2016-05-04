'use strict;'
var State = require('./conversation.state');

export function handle(bot, step){
  return new Promise(function(resolve, reject){
    var next = false;
    var data = false;
    var foundPattern;
    console.log('Checking pattern for step ' + step._id);
    data = checkEachPattern(bot, step);
    if(data){
      console.log('FOUND PATTERN')
      console.log(data.messages)
      next = data.next;
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
  var data = false;
  step.paths = step.paths || [];
  for (var j = 0; j < step.paths.length; j++){
    var path = step.paths[j];
    bot.state.entities = bot.state.entities || {};
    // Handle button logic
    if(path._id == bot.state.entities.button){
      data = {
        messages: path.button.messages,
        next: path.next
      }
      console.log('found it')
      console.log(data)

      return data;
    }

    if(path.patterns){
      // Check patterns
      for (var i = 0; i < path.patterns.length; i++) {
        // check if button matches pathId
        var patternMatches = checkPattern(bot, path.patterns[i])
        if(patternMatches){
          console.log(patternMatches)
          data = {
            messages: patternMatches.messages,
            next: path.next
          }
          return data;
        }
      }
    }
  }
  return data;

}

export function checkPattern(bot, pattern) {
  if (pattern.type == 'exact' && pattern.phrases) {
    for (var i = 0; i < pattern.phrases.length; i++) {
      if (pattern.phrases[i].toLowerCase() === bot.message.text.toLowerCase()) {
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
