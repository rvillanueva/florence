'use strict';

import mongoose from 'mongoose';

var BotSchema = new mongoose.Schema({
  status: String
});

export default mongoose.model('Bot', BotSchema);
