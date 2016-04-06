'use strict';

import mongoose from 'mongoose';

var MeasureSchema = new mongoose.Schema({
  key: String,
  name: String,
  description: String, 
  type: String // symptom, behavior, etc
});

export default mongoose.model('Measure', MeasureSchema);
