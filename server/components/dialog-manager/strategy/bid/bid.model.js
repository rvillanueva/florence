'use strict';

import mongoose from 'mongoose';

var BidSchema = new mongoose.Schema({
  // META
  userId: String,
  created: {
    source: String,
    sourceId: String,
    date: Date,
    turn: Number
  },
  // EDITABLE
  targets: {
    objective: String,
    entities: {}
  },
  force: Boolean,
  modifier: Number,
  expiration: {
    minutes: Number,
    turns: Number
  }
});

export default mongoose.model('Bid', BidSchema);
