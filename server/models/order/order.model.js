'use strict';

import mongoose from 'mongoose';

var OrderSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  params: {}
});

export default mongoose.model('Order', OrderSchema);
