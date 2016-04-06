// Asks for mood

var Messenger = require('../messenger')
var Promise = require("bluebird");


var mood = function(req, res){

}


export function mood(req, res) {
  return new Promise(function(resolve, reject){
    var messenger = Messenger.init();
    messenger.say('test');
    messenger.say('test');
    resolve(messenger.all());
  })
}
/*
  this.conversation = function(){
    messages.push('Just wanted to check in. Is now a good time?')
    console.log(messages);
  }

  this.responses = {
    input: "choice",
    responses: [
      {
        value: 'sure',
        callback: () => {
          this.messages.respond('yeah, I have some time')
          this.askForMood();
        }
      },
      {
        value: 'no',
        callback: () => {
          this.messages.respond('sorry, not right now');
          this.messages.say('No problem! I\'ll check back later.')
        }
      }
    ]
  }
*/
