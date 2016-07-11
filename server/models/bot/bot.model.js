'use strict';

import mongoose from 'mongoose';

var BotStateSchema = new mongoose.Schema({
  state: {
    taskId: String,
    flowIndex: String,
    responseId: String
  },
  stored: {},
  lastModified: Date
});

export default mongoose.model('BotState', BotStateSchema);
