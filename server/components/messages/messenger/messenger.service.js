'use strict';
import User from '../../../api/user/user.model';

export function checkUsersExist(entities){
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

    function checkUserExists(messengerId){
      User.findOne({'messenger.id': messengerId}, '_id').exec()
        .then(user => {
          if(!user){
            createMessengerUser(messengerId)
            .then(checkIfDone())
            .catch(err => {
              console.log(JSON.stringify(err))
            })
          } else {
            checkIfDone();
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
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

export function createMessengerUser(messengerId){
  return new Promise(function(resolve, reject){
    console.log('Saving new user...')

    var userData = {
      messenger: {
        id: messengerId
      },
    }
    var newUser = new User(userData);
    newUser.provider = 'facebook';
    newUser.role = 'user';
    newUser.save()
      .then(user => {
        console.log('Heres your user');
        console.log(JSON.stringify(user));
        resolve(user);
      })
      .catch(err => {
        console.log('Error saving new user...');
        console.log(JSON.stringify(err));
        reject(err);
      })
  })
}
