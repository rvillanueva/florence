'use strict';

import mongoose from 'mongoose';

var BotStateSchema = new mongoose.Schema({
  status: String,
  turn: Number,
  flow: {
    id: String,
    stepIndex: String,
    responses: {}
  },
  stored: {},
  updated: Date
});

export default mongoose.model('BotState', BotStateSchema);
