'use strict';

import mongoose from 'mongoose';

var TaskSchema = new mongoose.Schema({
  name: String,
  ownerId: String,
  organizationId: String,
  isActive: true,
  created: Date,
  lastModified: Date,
  questions: [{
    text: String,
    choices: [{
        match: {
          matchType: {
            type: String,
            enum: [
              'number',
              'date',
              'term',
              'pattern'
            ]
          },
          termKey: String,
          pattern: String,
          min: Number,
          max: Number
        },
        stored: {
          valueType: {
            type: String,
            enum: [
              'number',
              'date',
              'string',
              'boolean'
            ]
          },
          value: mongoose.ObjectTypes.Mixed
        }
    }]
  }],
  say: [{
    text: String
  }],
  actions: [{
    actionType: String,
    params: {}
  }],
  task: [{
    taskId: String,
    next: Boolean,
    priority: Number
  }],
  branches: [{
    conditions: [{
      conditionType: {
        type: String,
        enum: ['question']
      },
      questionId: String,
      operator: {
        type: String,
        enum: [
          'equal',
          'notEqual'
        ]
      },
      value: mongoose.ObjectTypes.Mixed
    }],
    elements: [{
      elementType: {
        type: String
      },
      elementId: String
    }]
  }],
  flow: [{
    elementId: String,
    elementType: {
      type: String
    }
  }],
});

export default mongoose.model('Task', TaskSchema);

/*
{
  "result": {
    "id": "SV_012345678912345",
    "name": "Example Survey",
    "ownerId": "UR_012345678912345",
    "organizationId": "exampleorganization",
    "isActive": true,
    "creationDate": "2016-03-08T10:56:30Z",
    "lastModifiedDate": "2016-03-08T10:56:43Z",
    "questions": {
      "QID1": {
        "questionType": {
          "type": "MC",
          "selector": "SAVR",
          "subSelector": "TX"
        },
        "questionText": "Click to write the question text",
        "choices": {
          "1": {
            "recode": "1",
            "description": "Click to write Choice 1"
          },
          "2": {
            "recode": "2",
            "description": "Click to write Choice 2"
          },
          "3": {
            "recode": "3",
            "description": "Click to write Choice 3"
          }
        }
      }
    },
    "exportColumnMap": {
      "Q1": {
        "question": "QID1"
      }
    },
    "blocks": {
      "BL_8IDNhnSYBOo5OSN": {
        "description": "Default Question Block",
        "elements": [
          {
            "type": "Question",
            "questionId": "QID1"
          }
        ]
      }
    },
    "flow": [
      {
        "id": "BL_8IDNhnSYBOo5OSN",
        "type": "Block"
      }
    ],
    "embeddedData": [],
    "responseCounts": {
      "auditable": 0,
      "generated": 0,
      "deleted": 0
    }
  },
  "meta": {
    "httpStatus": "200 - OK"
  }
}*/
