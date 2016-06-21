'use strict';

import mongoose from 'mongoose';

var ResponseSchema = new mongoose.Schema({
  intent: String,
  objective: String,
  execution: String
});

export default mongoose.model('Response', ResponseSchema);
