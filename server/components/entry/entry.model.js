'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  userId: String,
  created: Date,
  conversation: {
    messageId: String,
    promptTaskId: String,
    responseTaskId: String,
    programId: String,
    questionId: String
  },
  question: String,
  text: String,
  measure: {
    key: String,
    primaryParam: String,
  },
  params: {}
});

export default mongoose.model('Entry', EntrySchema);
