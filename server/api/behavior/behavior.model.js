'use strict';

import mongoose from 'mongoose';

var BehaviorSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Behavior', BehaviorSchema);
