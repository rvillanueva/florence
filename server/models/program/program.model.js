'use strict';

import mongoose from 'mongoose';

var ProgramSchema = new mongoose.Schema({
  name: String,
  protocols: [
    {
      trigger: {
        type: {
          type: String
        },
        params: {}
      },
      taskId: String
    }
  ]
});

export default mongoose.model('Program', ProgramSchema);
