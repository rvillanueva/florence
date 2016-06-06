'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  device: String,
  text: String,
  type: String,
  provider: String,
  attachments: Array,
  messenger: {
    id: String,
    mid: String,
    seq: Number
  }
});

export default mongoose.model('Message', MessageSchema);
