'use strict';

import mongoose from 'mongoose';

var GoalSchema = new mongoose.Schema({
  userId: String,
  type: {
    type: String
  },
  adherence: {
    activity: {
      name: String,
      verb: String,
      params: {},
    },
    expectedFrequency: {
      times: Number,
      unit: String
    },
    measurementSchedule: {
      daysOfWeek: [Number],
      hoursOfDay: [Number] //GMT
    },
  },
  created: {
    date: Date,
    userId: String
  }
});

export default mongoose.model('Goal', GoalSchema);


/*
outcome: {},
log: {
  measurementFrequency: {
    times: Number,
    unit: String
  }
},
*/
