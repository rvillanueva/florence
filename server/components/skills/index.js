var Measures = require('./measures');

var skills = Measures.actions();

export function interpretIntents(user, intents) {
/*
  Select best intent
  Choose action
  expected intent

  Skill + intent = action
  expected: {
    skill: name,
    intent: name,
    sent: Date
  }
}*/

}

export function getSkills() {
  // list of skills and associated intents
  //concatenate arrays
  return skills;
}

export function getActions(skillId){
  var actions = [];
  skills.forEach(function(el, i){
    if(el.skill == skillId){
      actions.push(el);
    }
  })
  return actions;
}
