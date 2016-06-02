'use strict';

import mongoose from 'mongoose';

var BidSchema = new mongoose.Schema({
  userId: String,
  force: Boolean,
  rewards: [
    {
      target: {
        task: String,
        emotion: String
      }
      value: Number,
      operation: String
    }
  ],
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
