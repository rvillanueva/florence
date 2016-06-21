'use strict';

import mongoose from 'mongoose';

var BotStateSchema = new mongoose.Schema({
  status: String,
  variables: {
    intro: Boolean
  }
});

export default mongoose.model('BotState', BotStateSchema);
