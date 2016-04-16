'use strict';

import mongoose from 'mongoose';

var ValueSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Value', ValueSchema);
