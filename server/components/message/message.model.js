'use strict';

import mongoose from 'mongoose';

var MessageSchema = new mongoose.Schema({
  userId: String,
  date: Date,
  text: String,
  provider: String,
  attachments: Array,
  messenger: {
    id: String,
    mid: String,
    seq: Number
  },
  extracted: {
    entities: {},
    traits: {},
    features: {}
  },
});

export default mongoose.model('Message', MessageSchema);
