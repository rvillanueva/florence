/**
 * Conversation model events
 */

'use strict';

import {EventEmitter} from 'events';
import Conversation from './conversation.model';
var ConversationEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ConversationEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Conversation.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ConversationEvents.emit(event + ':' + doc._id, doc);
    ConversationEvents.emit(event, doc);
  }
}

export default ConversationEvents;
