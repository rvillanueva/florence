'use strict';

import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
  text: String,
  choices: [{
    match: {
      matchType: {
        type: String,
        enum: [
          'number',
          'date',
          'term',
          'pattern',
          'classification'
        ]
      },
      termKey: String,
      classificationKey: String,
      pattern: String,
      min: Number,
      max: Number
    },
    stored: {
      valueType: {
        type: String,
        enum: [
          'number',
          'date',
          'string',
          'boolean'
        ]
      },
      value: mongoose.ObjectTypes.Mixed
    }
  }]
});

export default mongoose.model('Question', QuestionSchema);
