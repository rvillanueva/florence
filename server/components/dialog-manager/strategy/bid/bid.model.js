'use strict';

import mongoose from 'mongoose';

var BidSchema = new mongoose.Schema({
  // META
  userId: String,
  open: Boolean,
  created: {
    source: String,
    sourceId: String,
    date: Date,
    turn: Number
  },
  // EDITABLE
  target: {
    objective: String,
    params: {}
  },
  force: Boolean,
  modifier: Number,
  expiration: {
    minutes: Number,
    turns: Number
  }
});

export default mongoose.model('Bid', BidSchema);
