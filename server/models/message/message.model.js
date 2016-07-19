'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  timestamp: Date,
  author: {
    type: String,
    enum: [
      'user',
      'system',
      'manager'
    ]
  },
  provider: String,
  to: {
    mobile: String
  },
  from: {
    mobile: String
  },
  content: {
    text: String,
    attachments: Array,
  },
  meta: {
    twilio: {},
  },
});

export default mongoose.model('Message', MessageSchema);
