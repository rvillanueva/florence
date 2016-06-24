'use strict';

import mongoose from 'mongoose';

var GoalBarrier = new Schema({
  goalId: String,
  reason: String,
  created: {
    turn: Number,
    date: String,
  }
});

export default mongoose.model('GoalBarrier', GoalBarrier);
