'use strict';

import mongoose from 'mongoose';

var AspectSchema = new mongoose.Schema({
  key: {
    unique: true,
    type: String
  },
  type: String, // Value, belief, behavior, or outcome
  name: String,
  /*imageUrl: String,
  defaultFrequency: String, // weekly, weekly3, daily, daily3
  scale: {
    min: Number,
    max: Number,
    unit: String
  },
  questions: {
    score: Array,
    triggers: Array,
    confidence: Array,
    priority: Array
  }*/
});

export default mongoose.model('Aspect', AspectSchema);
