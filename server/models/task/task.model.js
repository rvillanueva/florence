'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
  organizationId: String,
  description: String,
  isActive: Boolean,
  created: Date,
  lastModified: Date,
  steps: [{
    type: {
      type: String,
      enum: [
        'question',
        'speech',
        'action'
      ]
    },
    questionId: String,
    speech: {
      text: String
    },
    action: {
      type: {
        type: String
      }
    },
    conditions: [{
      type: {
        type: String,
        enum: ['question']
      },
      questionId: String,
      operator: {
        type: String,
        enum: [
          'equal to',
          'not equal to',
          'less than',
          'greater than'
        ]
      },
      operand: {
        type: mongoose.Schema.Types.Mixed
      },
      conjunction: {
        type: String,
        enum: [
          'and',
          'or'
        ]
      }
    }]
  }],
});

export default mongoose.model('Task', TaskSchema);
