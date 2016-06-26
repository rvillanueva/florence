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
        sessionId: params.sessionId.toString(),
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

      try {
        var parsed = JSON.parse(body);
        if(parsed.status.code !== 200){
          console.log('API.ai error: ')
          console.log(parsed);
          console.log('params:')
          console.log(params);
          reject(new Error(parsed.status.errorType))
        } else {
          console.log('API.ai response: ')
          console.log(parsed);
          resolve(parsed)
        }
      }
      catch(err){
        console.log('ERROR')
        console.log(err)
        reject(err)
      }

    })

  })
}

export function addContexts(params){
  return new Promise(function(resolve, reject){
    var sessionId = params.sessionId;
    var contexts = params.contexts;
    // name, params (name, value), lifespan

    var options = {
      url: 'https://api.api.ai/v1/contexts',
      qs: {
        sessionId: sessionId.toString(),
      },
      json: true,
      auth: {
        bearer: process.env.API_AI_CLIENT
      },
      body: contexts
    }

    request.post(options, function(err, response, body){
      if(err){
        console.log(err)
        reject(err);
      }

      if(response.statusCode !== 200){
        console.log('API.ai error: ')
        console.log(body);
        reject(new Error(body.status.errorType))
      } else {
        console.log('Context added:' + JSON.stringify(body.names))
        resolve(body)
      }
    })


  })
}
