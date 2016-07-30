'use strict';

import mongoose from 'mongoose';

var InstructionSchema = new mongoose.Schema({
  text: String,
  measurement: {
    type: {
      type: String,
      enum: [
        'confidence',
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
