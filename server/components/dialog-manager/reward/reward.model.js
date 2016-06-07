'use strict';

import mongoose from 'mongoose';

var RewardSchema = new mongoose.Schema({
  targets: [{
    attribute: String,
    value: String
  }],
  value: Number,
  force: Boolean,
  operation: String
});

export default mongoose.model('Reward', RewardSchema);
