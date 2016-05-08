/**
 * Intent model events
 */

'use strict';

import {EventEmitter} from 'events';
import Intent from './intent.model';
var IntentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
IntentEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Intent.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    IntentEvents.emit(event + ':' + doc._id, doc);
    IntentEvents.emit(event, doc);
  }
}

export default IntentEvents;
