'use strict';

var FlowService = require('./flow.service');

/*
FLOW MODULE
Manages conversation transitions to improve coherence.
*/

export function handleTopicChange(bot){
  FlowService.isTopicChanging(bot)
  .then(bot => FlowService.handleTopicChange(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}

export function handleAskPermission(){
  // TaskService.checkIfTopicNeedsPermission
  // If true,
  // (queue current context)
  // TaskService.askPermission(topic)
}

export function handleAskPermissionResponse(){
  // If the last query was for permission and you get a yes/no response,
  // respond ok, then run task,
  // otherwise, ????? need a way to defer bids then select next task
}
