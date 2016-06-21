'use strict';

var ResponseService = require('./response.service');

export function handleExpectedInputs(bot){
  return ResponseService.handleExpectedResponse(bot);
}

export function handleInterjection(bot){
  return ResponseService.handleInterjection(bot);
}

export function handleNonUnderstanding(bot){
  return ResponseService.handleNonUnderstanding(bot);
}
