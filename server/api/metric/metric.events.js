/**
 * Metric model events
 */

'use strict';

import {EventEmitter} from 'events';
import Metric from './metric.model';
var MetricEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MetricEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Metric.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MetricEvents.emit(event + ':' + doc._id, doc);
    MetricEvents.emit(event, doc);
  }
}

export default MetricEvents;
