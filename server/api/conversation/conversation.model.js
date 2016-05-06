'use strict';

import mongoose from 'mongoose';

var RefSchema = new mongoose.Schema({
  weight: Number,
  type: String,
  conditions: [
    {
      type: String,
      variable: String,
      equality: String,
      value: String
    }
  ],
  refId: String
})


var StepSchema = new mongoose.Schema({
  type: String, // say, intent, messenger_buttons, messenger_cards
  update: [{
      type: String,
      variable: String,
      change: String,
      value: String,
  }],
  // SAY / MESSENGER_BUTTONS
  text: String,
  // INTENT
  matches: String,
  intents: [
    {
      intentId: String // match prebuilt intent
    }
  ],
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
  tags: Array,
  intent: String,
  next: [RefSchema],
  //type: String, // Learn, nudge, protocol, event
  steps: [StepSchema]
});

export default mongoose.model('Conversation', ConversationSchema);
