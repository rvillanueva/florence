'use strict';

import * as Step from './step';
import * as Sequence from './sequence';

export function run(convo) {
  // look at intent and context and attach appropriate next step as stepId
  // update context
  // should probably set up some DDOS protection here too using a ready to receive flag

  if (convo.active.intent) {
    if(!convo.context.stepId){
      return Sequence.start(res);
    } else {
      return Sequence.divert(res);
    }
  }

  if (convo.context.stepId) {
    return Step.answer(res);
  }

  res.intent = 'hello';
  return Conversation.divert(res);

}
