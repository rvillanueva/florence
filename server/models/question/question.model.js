'use strict';

import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
  text: String,
  choices: [{
    pattern: {
      type: {
        type: String,
        enum: [
          'number',
          'date',
          'expression',
          'match',
          'classification'
        ]
      },
      expressionKey: String,
      classificationKey: String,
      match: String,
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
