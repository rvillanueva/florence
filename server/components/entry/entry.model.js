'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  userId: String,
  created: Date,
  message: {
    id: String,
    text: String
  },
  task: {
    id: String,
    objective: String,
    params: {}
  },
  data: {
    type: {
      type: String,
      enum: [
        'number',
        'category'
      ]
    },
    value: mongoose.ObjectTypes.Mixed
  }
});

export default mongoose.model('Entry', EntrySchema);
