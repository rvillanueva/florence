'use strict';

var Promise = require("bluebird");
var request = require("request");

export function classify(query){
 return new Promise(function(resolve, reject){
  if(typeof query.text !== 'string'){
     reject('Input must be a string.')
   }
   var options = {
     url: "https://api.wit.ai/message",
     qs: {
       q: query.text,
       //context: context,
       v: '2014102'
     },
     auth: {
       bearer: process.env.WIT_SECRET
     }
   }

   request.get(options, function(err, response, body){
     if(err){
       reject(err);
     }
     var parsed = JSON.parse(body);
     console.log(parsed);
     var standardized = toStandard(parsed);
     resolve(standardized)
   })
 })
}

function toStandard(witResponse){
  return witResponse;
}
