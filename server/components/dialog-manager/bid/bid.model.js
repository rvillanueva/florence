'use strict';

import mongoose from 'mongoose';
import Reward from '../reward/reward.model';

var RewardSchema = Reward.schema;

var BidSchema = new mongoose.Schema({
  userId: String,
  rewards: [RewardSchema],
  created: {
    userId: String,
    date: Date,
    turn: Number
  },
  expires: {
    date: Date,
    turn: Number
  },
});

export default mongoose.model('Bid', BidSchema);
