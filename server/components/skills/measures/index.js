// Asks for mood


export function mood(req, res) {
  return {
    conversation: function(user, messenger){
      messenger.say('Just wanted to check in. Is now a good time?');
      return messenger.all();
    },
    respond: {
      input: "choice",
      options: [
        {
          value: 'sure',
          callback: (user, messenger, response) => {
            messenger.reply('yeah, I have some time')
            //this.askForMood();
          }
        },
        {
          value: 'no',
          callback: (user, messenger, response) => {
            messenger.reply('sorry, not right now')
          }
        }
      ]
    }
  }
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
