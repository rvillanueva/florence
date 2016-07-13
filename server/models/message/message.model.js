'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  author: {
    type: String,
    enum: [
      'user',
      'system'
    ]
  },
  date: Date,
  text: String,
  provider: String,
  mobile: {
    number: String,
    sid: String,
  },
  attachments: Array,
  messenger: {
    id: String,
    mid: String,
    seq: Number
  },
});

export default mongoose.model('Message', MessageSchema);
