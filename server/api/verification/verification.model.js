'use strict';

import mongoose from 'mongoose';

var VerificationSchema = new mongoose.Schema({
  userId: String,
  provider: String,
  facebook: {},
  token: String,
  expires: Date
});

export default mongoose.model('Verification', VerificationSchema);
