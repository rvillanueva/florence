'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  userId: String,
  meta: {
    created: Date,
    updated: Date,
  },
  params: {},
  value: {
    number: Number,
    date: Date,
    string: String
  },
  question: {
    text: String
  },
  response: {
    messageId: String,
    text: String
  }
});

export default mongoose.model('Entry', EntrySchema);
