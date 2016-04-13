'use strict';

import mongoose from 'mongoose';

var MeasureSchema = new mongoose.Schema({
  name: String,
  behavior: String,
  description: String,
  //unit: String,
  //min: Number,
  //max: Number
});

export default mongoose.model('Measure', MeasureSchema);
