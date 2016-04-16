/**
 * Belief model events
 */

'use strict';

import {EventEmitter} from 'events';
import Belief from './belief.model';
var BeliefEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
BeliefEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Belief.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    BeliefEvents.emit(event + ':' + doc._id, doc);
    BeliefEvents.emit(event, doc);
  }
}

export default BeliefEvents;
