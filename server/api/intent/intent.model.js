'use strict';

import mongoose from 'mongoose';

var IntentSchema = new mongoose.Schema({
  name: String,
  match: String,
  key: String, // match with Wit output etc-- = intent name TODO make unique
  urgent: Boolean,
  global: Boolean,
  conversationId: String,
  //public: Boolean,
});

export default mongoose.model('Intent', IntentSchema);
