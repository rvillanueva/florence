'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  user: String, //ref
  measure: String, //ref
  score: Number,
  triggers: String,
  tags: Array,
  created: Date
});

export default mongoose.model('Entry', EntrySchema);
