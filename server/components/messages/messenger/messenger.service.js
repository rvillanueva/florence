'use strict';
import User from '../../../api/user/user.model';

export function checkUsersExist(messages){
  return new Promise(function(resolve, reject){
    console.log('checking if users exist...')
    var idIndex = []
    var checkedCounter = 0;
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
    idIndex.forEach(function(id, i){
      checkUserExists(senderId);
    })

    function checkUserExists(messengerId){
      User.findOne({'messenger.id': messengerId}, '_id').exec()
        .then(user => {
          if(!user){
            console.log('No user found for messenger id: ' + messengerId)
            createMessengerUser(messengerId)
            .then(checkIfDone())
            .catch(err => {
              console.log('error: ')
              console.log(err)
            })
          } else {
            checkIfDone();
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    function checkIfDone(){
      checkedCounter++;
      if(checkedCounter == idIndex.length){
        console.log('done')
        resolve();
      } else if(checkedCounter > idIndex.length){
        console.log('error with counter')

        reject('Something is wrong with your check user counter...');
      }
    }
  })
}

export function createMessengerUser(messengerId){
  return new Promise(function(resolve, reject){
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
        resolve(user);
      })
      .catch(err => {
        reject(err);
      })
  })
}
