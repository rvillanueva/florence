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
  objective: String,
  attributes: {},
  params: {},
  text: String,
  choices: [{
    match: {
      type: {
        type: String,
        enum: [
          'number',
          'date',
          'expression'
        ]
      },
      min: Number,
      max: Number,
      expression: String
    },
    entry: {
      value: {
        number: Number,
        string: String
      }
    },
    fallback: Boolean,
    responses: [{
      text: String
    }],
    actions: [{
      type: String,
      params: {}
    }]
  }]
});

export default mongoose.model('Task', TaskSchema);
