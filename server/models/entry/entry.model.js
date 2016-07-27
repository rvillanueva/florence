'use strict';

import mongoose from 'mongoose';

var ResponseSchema = new mongoose.Schema({
  meta: {
    created: Date,
    updated: Date,
  },
  userId: String,
  value: {
    number: Number,
    date: Date,
    string: String
  },
  question: {
    questionId: String,
    text: String
  },
  response: {
    messageId: String,
    text: String
  }
});

export default mongoose.model('Response', ResponseSchema);
