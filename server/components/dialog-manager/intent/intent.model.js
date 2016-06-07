'use strict';

import mongoose from 'mongoose';
import Reward from '../reward/reward.model';

var RewardSchema = Reward.schema;

var IntentSchema = new mongoose.Schema({
  value: {
    unique: true,
    type: String
  },
  rewards: [RewardSchema]
});

export default mongoose.model('Intent', IntentSchema);
