'use strict';

import mongoose from 'mongoose';

var ConversationSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  step: String,
  topics: Array,
  messages: Array,
  entities: {},
  slots: Array,
  started: {
    by: String,
    date: Date,
    turn: Number,
  },
});

export default mongoose.model('Conversation', ConversationSchema);
