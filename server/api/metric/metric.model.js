'use strict';

import mongoose from 'mongoose';

var MetricSchema = new mongoose.Schema({
  aspect: String,
  metric: String,
  //name: String,
  question: String,
  //public: Boolean,
  //ownerId: String,
  validation: {
    type: {
      type: String
    }, // Numeric, categorical, text
    // NUMERIC
    min: Number,
    max: Number,
    // CATEGORICAL
    categories: [{
      matched: String,
      entity: String,
      value: String,
      stored: String
    }],
    // TEXT
    extracted: [{
      entity: String
    }]
  },
  /*dependencies: [{
      metricId: String
  }] // TODO Figure out how this works.*/
});

export default mongoose.model('Metric', MetricSchema);
