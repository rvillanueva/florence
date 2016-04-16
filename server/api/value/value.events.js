/**
 * Value model events
 */

'use strict';

import {EventEmitter} from 'events';
import Value from './value.model';
var ValueEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ValueEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Value.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ValueEvents.emit(event + ':' + doc._id, doc);
    ValueEvents.emit(event, doc);
  }
}

export default ValueEvents;
