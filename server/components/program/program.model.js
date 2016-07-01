'use strict';

import mongoose from 'mongoose';

var ProgramSchema = new mongoose.Schema({
  name: String,
  bids: [{
    objective: String,
    params: {},
    force: Boolean,
    modifier: Number
  }],
  key: String
});

export default mongoose.model('Program', ProgramSchema);
