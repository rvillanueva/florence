'use strict';

var TaskService = require('./task.service');

export function run(bot){
  TaskService.getTask(bot)
  .then(bot => TaskService.executeSend(bot))
  .then(bot => TaskService.handleWait(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}

export function respond(bot){
  TaskService.fillSlots(bot)
  .then(bot => TaskService.handleCompletion(bot))
  .then(bot => TaskService.handleClarification(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}

// -- GET

export function get(bot){
  return TaskService.get(bot);
}

export function getById(bot){
  return TaskService.getById(bot);
}

export function getByTypes(bot){
  return TaskService.getByTypes(bot);
}

export function buildIndex(bot){
  return TaskService.buildIndex(bot);
}

// Apply slot matching scores
export function applyToScores(bot){
  return TaskService.applyToScores(bot);
}
