'use strict';

import mongoose from 'mongoose';

var InstructionSchema = new mongoose.Schema({
  text: String,
  measurement: {
    type: String, //confidence/propensity/completedFrequency/missedFrequency/taskCompletion
    frequency: {
      type: String,
      enum: [
        'daily',
        'weekly'
      ]
    }
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
          'recurring',
          'general'
        ]
      },
      once: {
        comparator: {
          type: String,
          enum: [
            'on',
            'by',
            'after'
          ]
        },
        date: Date
      },
      recurring: {
        times: Number,
        every: {
          type: String,
          enum: [
            'day',
            'week'
          ]
        }
      },
    }
  }
});

export default mongoose.model('Instruction', InstructionSchema);
