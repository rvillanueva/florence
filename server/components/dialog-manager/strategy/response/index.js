'use strict';

var ResponseService = require('./response.service');

export function handleExpected(bot){
  return ResponseService.handleExpected(bot);
}

export function handleUnexpected(bot){
  return ResponseService.handleUnexpected(bot);
}

export function handleNonUnderstanding(bot){
  return ResponseService.handleNonUnderstanding(bot);
}
