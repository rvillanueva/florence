var Promise = require("bluebird");
var request = require("request");
var Messages = require("../../messages");
import User from '../../../api/user/user.model';

function formatMessage(messageObj){
  return new Promise(function(resolve, reject){
    User.findOne({'messenger.id': messageObj.sender.id}, '_id').exec()
      .then(user => {
        var formatted = {
          userId: user._id,
          timestamp: messageObj.timestamp,
          from: 'user',
          interface: 'messenger'
        }

        if(messageObj.postback){
          formatted.data = messageObj.postback.payload;
        }

        if(messageObj.message){
          formatted.messenger = {};
          formatted.messenger.mid = formattedMsg.messenger.mid;
          formatted.messenger.seq = formattedMsg.messenger.seq;
          formatted.text = messageObj.message.text;
          formatted.attachments = messageObj.message.attachments
        }

        if(formatted.text){
          formatted.input = 'text'
        }

        if(formatted.data){
          formatted.input = 'button'
        }

        resolve(formatted);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export function send(user, message) {
  if(!user.messenger || !user.messenger.id){
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
    console.log(JSON.stringify(body));
  })
}

export function receive(data){
  var entries = data.entry;
  entries.forEach(function(entry, i){
    var messages = entries.messaging;
    messages.forEach(function(message, j){
      formatMessage(message)
        .then(userId => {
          Messages.receive(message);
        })
        .catch(err => {
          console.log(err);
        })
    })
  })
}
