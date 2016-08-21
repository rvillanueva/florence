'use strict';

import mongoose from 'mongoose';

var IntentSchema = new mongoose.Schema({
  name: String,
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
