'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  userId: String,
  meta: {
    created: Date,
    updated: Date,
    taskId: String,
    params: {},
    prompt: String,
  },
  value: {
    number: Number,
    date: Date,
    string: String
  },
  response: {
    messageId: String,
    text: String
  }
});

export default mongoose.model('Entry', EntrySchema);
