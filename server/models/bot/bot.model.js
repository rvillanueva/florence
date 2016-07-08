'use strict';

import mongoose from 'mongoose';

var BotStateSchema = new mongoose.Schema({
  state: {
    id: String,
    stepIndex: String,
    responseId: String
  },
  stored: {},
  lastModified: Date
});

export default mongoose.model('BotState', BotStateSchema);
