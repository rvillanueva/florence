
var Wit = require('./wit');
var Promise = require("bluebird");

export function intent(message){
  return new Promise(function(resolve, reject){
    Wit.intent(message)
    .then(intent => {
      resolve(intent);
    })
    .catch(err => {
      reject(err);
    })
  });
}

/*
export function themes(message){
 // placeholder
}

export function tags(message){

}
*/
