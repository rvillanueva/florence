export function init() {
  var messages = [];
  return {
    say: function(text){
      messages.push(text);
    },
    all: function(){
      return messages;
    }
  }
}
