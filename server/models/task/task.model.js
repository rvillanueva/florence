'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: {
    type: String,
    enum: [
      'ask',
      'say'
    ]
  },
  text: String,
  objective: String,
  attributes: {},
  params: {},
  choices: [{
    input: {
      type: {
        type: String,
        enum: [
          'number',
          'integer',
          'date',
          'string'
        ]
      },
      min: Number,
      max: Number,
      expression: String
    },
    entry: {
      recode: Boolean,
      value: {
        number: Number,
        string: String
      }
    },
    fallback: Boolean,
    responses: [String],
    actions: [{
      type: String,
      params: {}
    }]
  }]
});

export default mongoose.model('Task', TaskSchema);
