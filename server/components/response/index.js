'use strict';

var Promise = require('bluebird');
var request = require('request');

export function query(params){
  return new Promise(function(resolve, reject){
    // Query API.ai for a response
    var options = {
      url: "https://api.api.ai/v1/query",
      qs: {
        query: params.text,
        sessionId: params.sessionId,
        lang: 'en',
        v: 20150910
      },
      auth: {
        bearer: process.env.API_AI_CLIENT
      }

    }

    request.get(options, function(err, response, body){
      if(err){
        reject(err);
      }
      var parsed = JSON.parse(body);
      console.log('API.AI response: ')
      console.log(parsed);
      resolve(parsed)
    })

  })
}
