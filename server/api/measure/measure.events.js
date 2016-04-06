/**
 * Measure model events
 */

'use strict';

import {EventEmitter} from 'events';
import Measure from './measure.model';
var MeasureEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MeasureEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Measure.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MeasureEvents.emit(event + ':' + doc._id, doc);
    MeasureEvents.emit(event, doc);
  }
}

export default MeasureEvents;
