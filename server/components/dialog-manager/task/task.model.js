'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  objective: String,
  aliasOf: String,
  type: { // say, ask
    type: String,
    required: true,
    enum: [
      'say',
      'ask',
      'respond'
    ]
  },
  params: {},
  say: String,
  actions: [{
    type: {
      type: String
    },
    params: {}
  }],
  public: Boolean,
  auth: {
    ownerId: String
  },
  validation: {
    type: {
      type: String,
      enum: [
        'number',
        'category',
        'open',
        'entity'
      ]
    },
    min: Number,
    max: Number,
    terms: [
      {
        value: String,
        synonyms: [String]
      }
    ],
    entity: String
  }
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
