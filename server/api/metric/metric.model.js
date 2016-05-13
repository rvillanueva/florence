'use strict';

import mongoose from 'mongoose';

var MetricSchema = new mongoose.Schema({
  aspectKey: String,
  metricKey: String,
  name: String,
  question: String,
  public: Boolean,
  ownerId: String,
  accepted: {
    dataType: String, // Numeric, categorical, text
    // NUMERIC
    min: Number,
    max: Number,
    // CATEGORICAL
    matched: String,
    entity: String,
    value: String,
    // TEXT
    extracted: [{
      entity: String
    }]
  },
  dependencies: [{
      metricId: String
  }] // TODO Figure out how this works.
});

export default mongoose.model('Metric', MetricSchema);
