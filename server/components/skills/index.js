var Measures = require('./measures');

var skills = Measures.actions();

var SkillMap = {
  mood: {
    startMeasureEntry: Measures.start(user, 'mood', value),
    enterMeasureValue: Measures.enterValue(user, 'mood', value),
    enterMeasureTrigger: Measures.enterTrigger(user, 'mood', text)
  }
}

export function mapIntent(user, intents) {
  // Figure out what entities are needed for each
  // Check that all required entities have been identified
  // Clarify if required entities are missing for action

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
