'use strict';

import mongoose from 'mongoose';

var GoalSchema = new Schema({
  userId: String,
  behavior: String,
  measurement: {
    frequency: Number,
    frequencyUnit: String
  },
  expected: {
    frequency: 1,
    frequencyUnit: String
  }
});

export default mongoose.model('Goal', GoalSchema);
