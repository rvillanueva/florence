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
          'match'
        ]
      },
      expressionKey: String,
      matches: [
        {
          term: String
        }
      ],
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
      value: mongoose.Schema.Types.Mixed
    }
  }]
});

export default mongoose.model('Question', QuestionSchema);
