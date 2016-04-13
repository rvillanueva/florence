// Asks for mood

var Mood = require('./mood')

export function mood(req, res) {
  return Mood;
}

export function getSkills(){
  var actions = [
    {
      skill: 'mood',
      actions: Mood.actions();
    }
  ];
  return actions;
}

export function log(user, value, measure) {
  // save measure score
}
