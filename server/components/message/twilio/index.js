var Promise = require("bluebird");
var TwilioService = require('./twilio.service');

export function send(message) {
  return new Promise(function(resolve, reject){
    TwilioService.sendToApi(message)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

export function standardize(data){
  return new Promise(function(resolve, reject){
    var message = {
      content: {
        text: data.Body
      },
      to: {
        mobile: data.To
      },
      from: {
        provider: 'twilioSms',
        mobile: data.From
      },
      meta: {
        twilioSms: data
      }
    }
    resolve(message)
  })
}
