'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
  organizationId: String,
  isActive: true,
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
      conditionType: {
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
      operand: mongoose.ObjectTypes.Mixed,
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
