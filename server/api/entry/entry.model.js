'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  //userId: Ref
  start: Date,
  data: [
    {
      measureId: String, // should really be ref, required
      parameter: String,   // optional, e.g. a specific drug for med adherence
      score: Number,
      value: String,
      response: String,
      input: String // either text or choice
    }
  ],
  //symptoms: Array,
  tags: Array, // array of strings
  topics: Array // array of strings
});

export default mongoose.model('Entry', EntrySchema);
