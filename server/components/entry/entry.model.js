'use strict';

import mongoose from 'mongoose';

var MedicationSchema = new mongoose.Schema({
  trade_name: String
})

var ActivitySchema = new mongoose.Schema({
  activity_name: String
})

var FrequencySchema = new mongoose.Schema({
  number_of_times: Number,
  time_window: {
    value: Number,
    unit: String
  }
})

var ScheduleItemSchema = new mongoose.Schema({
  dose_recurrence: {
    frequency: FrequencySchema
  }
})

// TOP LEVEL SCHEMAS

var EffectiveTimeFrameSchema = new mongoose.Schema({
  time_interval: {
    start_date_time: Date,
    end_date_time: Date
  }
})

var ReasonMedicationMissedSchema = new mongoose.Schema({
  medication: MedicationSchema,
  reason_for_missing_dose: String
})

var ConcernAboutMedication = new mongoose.Schema({
  medication: MedicationSchema,
  concern_about_medication: {
    medication_concern_category: String
  }
})

var ConcernAboutActivity = new mongoose.Schema({
  activity: ActivitySchema,
  concern_about_activity: {
    activity_concern_category: String,
  }
})

var MedicationPrescriptionSchema = new mongoose.Schema({
    medication: MedicationSchema,
    schedule: [ScheduleItemSchema]
})

var ActivityPrescriptionSchema = new mongoose.Schema({
    activity: ActivitySchema,
    schedule: [ScheduleItemSchema]
})


var EntrySchema = new mongoose.Schema({
  meta: {
    userId: String,
    type: {
      type: String
    },
    prompt_phrasing: String,
    message: {
      text: String,
      extracted: {
        entities: {},
        traits: {},
        features: {}
      },
    },
    revisions: [{
      revision_type: String,
      source_name: String,
      revision_date_time: Date,
      source_id: String
    }],
  },
  header: {
    creation_date_time: Date,
    acquisition_provenance: {
      source_name: String,
      modality: String
    },
  },
  body: {
    effective_time_frame: EffectiveTimeFrameSchema,
    medication_prescription: MedicationPrescriptionSchema,
    activity_prescription: ActivityPrescriptionSchema
  }
});

export default mongoose.model('Entry', EntrySchema);
