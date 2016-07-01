'use strict';

import mongoose from 'mongoose';

var ProgramSchema = new mongoose.Schema({
  name: String,
  questions: [{
    taskId: String,
    say: String,
    validation: {
      number: {
        min: Number,
        max: Number
      },
      categories: [
        {
          phrase: String,
          synonyms: [String]
        }
      ]
    }
  }]
});

export default mongoose.model('Program', ProgramSchema);
