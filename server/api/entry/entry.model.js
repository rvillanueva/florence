'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  userId: String, //ref
  date: Date,
  data: {}
});

export default mongoose.model('Entry', EntrySchema);
