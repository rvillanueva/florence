'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  objective: String,
  type: { // say, ask
    type: String
  },
  preconditions: [{
    type: {
      type: String
    },
    params: {}
  }],
  entities: {},
  slots: [
    {
      entity: String,
      validation: {
        min: Number,
        max: Number,
        values: Array
      },
      ask: String
    }
  ],
  say: String,
  action: {
    name: String,
    params: {}
  },
  next: [{
    intent: String,
    objective: String,
    execution: String
  }]
});

export default mongoose.model('Task', TaskSchema);



/*attachments: [
  {
    type: String,
    title: String,
    subtitle: String,
    imageUrl: String,
    postback: String,
    webUrl: String
  }
],*/
