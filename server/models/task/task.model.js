'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  objective: String,
  aliasOf: String,
  type: { // say, ask
    type: String,
    required: true,
    enum: [
      'say',
      'ask',
      'respond'
    ]
  },
  params: {},
  say: String,
  actions: [{
    type: {
      type: String
    },
    params: {}
  }],
  public: Boolean,
  integration: {
    available: Boolean,
    params: {}
  },
  ownerId: String
});

export default mongoose.model('Task', TaskSchema);
