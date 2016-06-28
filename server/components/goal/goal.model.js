'use strict';

import mongoose from 'mongoose';

var EntrySchema = new mongoose.Schema({
  userId: String,
  type: {
    type: String
  },
  message: {
    id: String,
    text: String,
    features: {}
  },
  adherence: {
    activity: {
      name: String,
      params: {},
    },
    frequency: {
      times: Number,
      unit: String
    },
  },
  created: {
    date: Date,
    userId: String
  }
});

export default mongoose.model('Entry', EntrySchema);


/*
outcome: {},
log: {
  measurementFrequency: {
    times: Number,
    unit: String
  }
},
measurementSchedule: {
  daysOfWeek: [Number],
  hoursOfDay: [Number] //GMT
},

*/
