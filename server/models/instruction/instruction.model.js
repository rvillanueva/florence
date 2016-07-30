'use strict';

import mongoose from 'mongoose';

var InstructionSchema = new mongoose.Schema({
  meta: {
    created: {
      type: Date,
      default: Date.now
    }
  },
  text: String,
  archived: Boolean,
  measurement: {
    type: {
      type: String,
      enum: [
        'futureConfidence',
        'propensity',
        'completedFrequency',
        'missedFrequency',
        'taskCompletion',
        'custom'
      ]
    },
    frequency: {
      type: String,
      enum: [
        'daily',
        'weekly'
      ]
    },
    period: {
      type: String,
      enum: [
        'day',
        'week'
      ]
    },
    lastEntry: Date
  },
  action: {
    phrase: String,
    type: {
      type: String
    },
    params: {},
    timing: {
      type: {
        type: String,
        enum: [
          'once',
          'repeating',
          'general'
        ]
      },
      timeframe: {
        from: Date,
        to: Date
      },
      times: Number,
      every: {
        type: String,
        enum: [
          'day',
          'week',
          'dayOfWeek'
        ]
      }
    }
  }
});

export default mongoose.model('Instruction', InstructionSchema);
