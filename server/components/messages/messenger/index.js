var Promise = require("bluebird");
var request = require("request");
var Messages = require("../../messages");


export function send(user, message) {
  if(!user.facebook || !user.facebook.id){
    console.log('Error: No Facebook id.')
    return false;
  }

  var body = {
    recipient: {
      id: userId
    },
    message: message
  }

  var options = {
    uri: 'https://graph.facebook.com/v2.6/me/messages?access_token=' + process.env.FB_PAGE_TOKEN,
    body: body
  }
  request.post(options).success(function(err, response, body){
    console.log(body);
  })
}

export function receive(message){
  Messages.receive(message);
}
