'use strict';

var IntentService = require('./intent.service');

// Get all intents
// OUtPUT: cache.intents
export function get(bot){
  return IntentService.get(bot);
}
