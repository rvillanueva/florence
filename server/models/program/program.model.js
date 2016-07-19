'use strict';

import mongoose from 'mongoose';

var ProgramSchema = new mongoose.Schema({
  name: String,
  description: String,
  ownerId: String,
  organizationId: String,
  protocols: [
    {
      trigger: {
        type: {
          type: String,
          enum: [
            'timed',
            'recurring'
          ]
        },
        params: {}
      },
      taskId: String
    }
  ]
});

export default mongoose.model('Program', ProgramSchema);
