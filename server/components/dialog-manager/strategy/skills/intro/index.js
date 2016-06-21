'use strict';

export function applySkill(bot){
  return new Promise(function(resolve, reject){
    var actions = [];
    if(!bot.state.variables.intro){
      Bid.create({
        targets: {
          objective: 'introduceSelf'
        }
      })
    }
    Promise.all()
    .then(() => resolve(bot))
    .catch(err => reject(err))
  })
}
