'use strict';

import mongoose from 'mongoose';

var VerificationSchema = new mongoose.Schema({
  userId: String,
  provider: String,
  facebook: {},
  token: String
});

export default mongoose.model('Verification', VerificationSchema);
