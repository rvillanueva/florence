'use strict';

import mongoose from 'mongoose';

var ResponseSchema = new mongoose.Schema({
  meta: {
    created: Date,
    lastModified: Date,
    userId: String,
    flowId: String
  },
  data: [
    {
      stored: {
        valueType: {
          type: String,
          enum: [
            'number',
            'date',
            'string',
            'boolean'
          ]
        },
        value: mongoose.Schema.Types.Mixed
      },
      question: {
        id: String,
        text: String
      },
      response: {
        messageId: String,
        text: String
      },
    }
  ]
});

export default mongoose.model('Response', ResponseSchema);
