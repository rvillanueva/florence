'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  type: String,
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
  say: String,
  attachments: [
    {
      type: String,
      title: String,
      subtitle: String,
      imageUrl: String,
      postback: String,
      webUrl: String
    }
  ],
  action: {
    name: String,
    params: {}
  },
  clarifications: {
    confirmation: String
  }
});

export default mongoose.model('Task', TaskSchema);
