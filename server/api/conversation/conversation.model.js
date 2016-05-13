'use strict';

import mongoose from 'mongoose';

var RefSchema = new mongoose.Schema({
  weight: Number,
  conditions: [
    {
      type: String,
      variable: String,
      equality: String,
      value: String
    }
  ],
  stepId: String
})


var StepSchema = new mongoose.Schema({
  type: String, // say, intent, messenger_buttons, messenger_cards// diversion//action
  actions: [{
      action: String,
      params: {}
  }],
  name: String,
  // SAY / MESSENGER_BUTTONS
  text: String,
  // INTENT
  intentId: String,
  // MESSENGER BUTTONS
  messenger_buttons: [
    {
      type: String,
      title: String,
      //data
    }
  ],
  // MESSENGER CARDS
  cards: [
    {
      type: String,
      title: String,
      subtitle: String,
      // data
    }
  ],
  next: [RefSchema]
})

var ConversationSchema = new mongoose.Schema({
  name: String,
  intent: String,
  global: Boolean,
  next: [RefSchema],
  //type: String, // Learn, nudge, protocol, event
  steps: [StepSchema]
});

export default mongoose.model('Conversation', ConversationSchema);
