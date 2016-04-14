var Measures = require('../../measures');
var Triggers = require('../../triggers');

export function actions(req, res) {
  return [
    {
      intent: 'setMeasureScore',
      action: logMeasureScore(user, score)
    },
    {
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
