/**
 * Aspect model events
 */

'use strict';

import {EventEmitter} from 'events';
import Aspect from './aspect.model';
var AspectEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AspectEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Aspect.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AspectEvents.emit(event + ':' + doc._id, doc);
    AspectEvents.emit(event, doc);
  }
}

export default AspectEvents;
