'use strict';

import mongoose from 'mongoose';
import Bid from '../bid/bid.model';

var BidSchema = Bid.schema;

var ResponseSchema = new mongoose.Schema({
  features: {},
  bids: [BidSchema]
});

export default mongoose.model('Response', ResponseSchema);
