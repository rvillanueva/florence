'use strict';

import mongoose from 'mongoose';

var BeliefSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Belief', BeliefSchema);
