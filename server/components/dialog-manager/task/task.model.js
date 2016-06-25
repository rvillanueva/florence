'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  objective: String,
  aliasOf: String,
  type: { // say, ask
    type: String,
    required: true
  },
  params: {},
  validation: {}, // takes min, max, and values []
  say: String,
  actions: [{
    type: {
      type: String
    },
    params: {}
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
],
preconditions: [{
  type: {
    type: String
  },
  params: {}
}],*/
