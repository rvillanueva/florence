'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  type: String,
  text: String,
  button: Object
})

var PatternSchema = new mongoose.Schema({
  type: String,
  phrases: Array,
  messages: [MessageSchema]
})

var PathSchema = new mongoose.Schema({
  name: String,
  next: {
    action: String,
    stepId: String
  },
  button: {
    title: String,
    subtitle: String,
    imgUrl: String,
    messages: [MessageSchema]
  },
  patterns: [PatternSchema]
})

var StepSchema = new mongoose.Schema({
  name: String,
  type: String,
  next: {
    action: String,
    stepId: String
  },
  retries: {
    max: Number,
    replies: Array // Array string
  },
  messages:[MessageSchema],
  paths:[PathSchema]
})

var ConversationSchema = new mongoose.Schema({
  name: String,
  steps: [StepSchema]
});

export default mongoose.model('Conversation', ConversationSchema);
