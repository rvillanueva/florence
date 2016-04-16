'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  userId: String, //ref
  aspectId: String, //ref
  score: Number,
  priority: Number,
  confidence: Number,
  triggers: String,
  tags: Array,
  created: Date
});

export default mongoose.model('Entry', EntrySchema);
