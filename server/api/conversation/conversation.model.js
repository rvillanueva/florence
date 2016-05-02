'use strict';

import mongoose from 'mongoose';

var MessageResponseSchema = new mongoose.Schema({
  type: String,
  text: String,
  button: Object
})

var PatternSchema = new mongoose.Schema({
  type: String,
  phrases: Array,
  messages: [MessageResponseSchema]
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
    messages: [MessageResponseSchema]
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
  messages:[MessageResponseSchema],
  paths:[PathSchema]
})

var ConversationSchema = new mongoose.Schema({
  name: String,
  steps: [StepSchema]
});

export default mongoose.model('Conversation', ConversationSchema);
