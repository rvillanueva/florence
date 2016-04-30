'use strict';

export function checkPaths(bot, paths) {
  paths.forEach(function(path, p){
    for (var i = 0; i < path.data.patterns.length; i++) {
      var pattern = checkPattern(path.patterns[i])
      if(pattern){
        var data = {
          p: p,
          pattern: pattern
        }
        return data;
      }
    }
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
  } else if (
    pattern.type == 'button' &&
    pattern.button.value == pattern.value
  ){
    return pattern;
  } else {
    return false;
  }
}
