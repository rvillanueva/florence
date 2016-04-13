var Messenger = require('./messenger')

export function send(user, message){
  Messenger.send(user, message);
}

export function receive(message){
  Messenger.receive(message);
}
