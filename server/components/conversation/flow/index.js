'use strict';

/*
FLOW MODULE
Manages conversation transitions to improve coherence.
*/

export function handleTopicChange(){
  // TaskService.checkIfTopicChanged
  // If topic changed,
  // Transformer.addTopicTransition
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
  // otherwise, ????? need a way to defer bids
}
