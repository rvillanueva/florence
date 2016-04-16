/**
 * Outcome model events
 */

'use strict';

import {EventEmitter} from 'events';
import Outcome from './outcome.model';
var OutcomeEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OutcomeEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Outcome.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OutcomeEvents.emit(event + ':' + doc._id, doc);
    OutcomeEvents.emit(event, doc);
  }
}

export default OutcomeEvents;
