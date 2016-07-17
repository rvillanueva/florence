'use strict';

import mongoose from 'mongoose';

var QuestionSchema = new mongoose.Schema({
  text: String,
  nickname: String,
  acceptAllInputs: Boolean,
  choices: [{
    type: {
      type: String,
      enum: [
        'number',
        'integer',
        'date',
        'category'
      ]
    },
    min: Number,
    max: Number,
    category: String,
    hidden: Boolean,
    patterns: [
      {
        type: {
          type: String,
          enum: [
            'expression',
            'term'
          ]
        },
        expressionKey: String,
        term: String,
        min: Number,
        max: Number
      }
    ]
  }]
});

export default mongoose.model('Question', QuestionSchema);
