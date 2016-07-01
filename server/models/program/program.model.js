'use strict';

import mongoose from 'mongoose';

var ProgramSchema = new mongoose.Schema({
  name: String,
  bids: [{
    target: {
      taskId: String,
      objective: String,
      params: {}
    },
    modifier: Number
  }]
});

export default mongoose.model('Program', ProgramSchema);
