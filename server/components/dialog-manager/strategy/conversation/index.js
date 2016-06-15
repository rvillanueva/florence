'use strict';

var Promise = require('bluebird');
var ConversationService = require('./conversation.service');

// CONVERSATION STRATEGY
// Adds score modifiers for topic adjacency and topic recency

export function update(bot){

}

export function applyToScores(bot){
  ConversationService.getRelevant(bot)
  .then(bot => ConversationService.applyModifiers(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}
