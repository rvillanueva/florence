'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  user: String, //ref
  measure: String, //ref
  value: Number,
  added: Date
});

export default mongoose.model('Entry', EntrySchema);
