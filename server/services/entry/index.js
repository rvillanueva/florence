'use strict';

var Promise = require('bluebird');
var EntryInterface = require('../../models/entry');
var InstructionService = require('../instruction');

export function processNewEntry(entry){
  var instructionId;
  return new Promise(function(resolve, reject){
    entry.meta = entry.meta || {};
    entry.meta.params = entry.meta.params || {};

    instructionId = entry.meta.params.instructionId;

    EntryInterface.create(entry)
    .then(() => updateAdherenceScore())
    .then(() => resolve(true))
    .catch(err => reject(err))
  })

  function updateAdherenceScore(){
    return new Promise(function(resolve, reject){
      if(instructionId){
        InstructionService.updateAdherenceScore(instructionId)
        .then(() => resolve(true))
        .catch(err => reject(err))
      } else {
        resolve(false)
      }
    })
  }
}
