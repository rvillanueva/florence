'use strict';

var Promise = require('bluebird');
var Conversation = require('../../conversation');
var ConversationService = require('./conversations.service');

export function applyToScores(bot){
  Conversation.getRelevant(bot)
  .then(bot => ConversationService.applyConversations(bot))
  .then(bot => resolve(bot))
  .catch(err => reject(err))
}
