'use strict';

export function createNewUsers(entities){
  return new Promise(function(resolve, reject){
    var idIndex = []
    var checkedCounter = 0;
    entries.forEach(function(entry, i){
      var messages = entries.messaging;
      messages.forEach(function(message, j){
        var senderId = message.sender.id;
        var found = false;
        idIndex.forEach(function(id, k){
          if(id == message.sender.id){
            found = true;
          }
        })
        if(!found){
          idIndex.push(senderId);
        }
      })
    })
    idIndex.forEach(function(id, i){
      checkUserExists(senderId);
    })

    function checkUserExists(senderId){
      User.findOne({'messenger.id': messageObj.sender.id}, '_id').exec()
      .then(user => {
        if(!user){
          var newUser = {
            messenger: {
              id: senderId
            },
            role: 'user'
          }
          User.create(newUser)
          .then(checkIfDone())
          .catch(reject(err));
        }
      })
    }
    function checkIfDone(){
      checkedCounter++;
      if(checkedCounter == idIndex.length){
        resolve();
      } else if(checkedCounter > idIndex.length){
        reject('Something is wrong with your check user counter...');
      }
    }
  })
}
