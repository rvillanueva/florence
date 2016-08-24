'use strict';

import mongoose from 'mongoose';

var IntentSchema = new mongoose.Schema({
  name: String,
  key: {
    type: String,
    unique: true
  },
  responses: [{
    description: String,
    conditions: {},
    say: [String],
    actions: [{
      key: String
    }]
  }]
});

export default mongoose.model('Intent', IntentSchema);
