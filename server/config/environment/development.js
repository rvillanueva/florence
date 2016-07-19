'use strict';

// Development specific configuration
// ==================================
var config = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/river-dev'
  },
}
// Seed database on startup

if(process.env.SEED_DB){
  config.seedDB = true
} else {
  config.seedDB = false;
}

module.exports = config;
