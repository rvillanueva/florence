'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  created: Date,
  delivered: Date,
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
    userId: String,
    mobile: String
  },
  from: {
    userId: String,
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
