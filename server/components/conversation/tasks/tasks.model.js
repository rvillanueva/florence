'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  slots: [
    {
      entity: String,
      validation: {
        min: Number,
        max: Number,
        values: Array
      },
      ask: String
    }
  ],
  action: String,
  clarifications: {
    confirmation: String
  }
});

export default mongoose.model('Task', TaskSchema);
