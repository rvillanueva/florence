'use strict';

import mongoose from 'mongoose';

var BotStateSchema = new mongoose.Schema({
  status: String
});

export default mongoose.model('BotState', BotStateSchema);
