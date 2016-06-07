'use strict';

import mongoose from 'mongoose';

/*
CONVERSATION
A conversation is composed of

1) an intent (when user-initiated)
2) an associated task
3) entities/properties associated with it

*/

var ConversationSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  step: String,
  topics: Array,
  messages: Array,
  entities: {},
  started: {
    by: String,
    intent: String,
    date: Date,
    turn: Number,
  },
});

export default mongoose.model('Conversation', ConversationSchema);
