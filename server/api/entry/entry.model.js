'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  userId: String, //ref
  aspectId: String, //ref
  score: Number,
  context: [
    {
      type: String,
      value: String
    }
  ],
  date: Date
});

export default mongoose.model('Entry', EntrySchema);
