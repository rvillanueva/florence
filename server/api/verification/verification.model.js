'use strict';

import mongoose from 'mongoose';

var VerificationSchema = new mongoose.Schema({
  userId: String,
  provider: String,
  profile: {},
  token: String,
  expires: Date
});

export default mongoose.model('Verification', VerificationSchema);
