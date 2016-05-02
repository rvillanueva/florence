'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  timestamp: Date,
  from: String,
  text: String,
  type: String,
  input: String,
  attachments: Array,
  button: String,
  interface: String,
  messenger: {
    mid: String,
    seq: Number
  }
});

export default mongoose.model('Message', MessageSchema);
