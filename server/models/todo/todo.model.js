'use strict';

import mongoose from 'mongoose';

var TodoSchema = new mongoose.Schema({
  userId: String,
  taskId: String,
  forced: Boolean,
  started: Boolean,
  completed: Boolean
});

export default mongoose.model('Todo', TodoSchema);
