var Measures = require('../../measures');
var Triggers = require('../../triggers');

export function actions(req, res) {
  return [
    {
      initiated: true,
      collected: false,
      intent: 'startMeasure',
      action: startConversation(user)
    },
    {
      initiated: true,
      collected: true,
      intent: 'setMeasureScore',
      action: logMeasureScore(user, score)
    },
    {
      initiated: true,
      collected: true,
      intent: 'setMeasureTrigger',
      action: logMeasureTrigger(user, text);
    }
  ]
}

function logMeasureScore(){
  // validate

}

function logMeasureTrigger(user, text){
  Triggers.log(user, text, 'mood');
}
