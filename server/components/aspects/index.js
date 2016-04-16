import Aspect from '../../api/aspect/aspect.model';
var Promise = require('bluebird');

export function getById(id) {
  return new Promise(function(resolve, reject){
    Aspect.findById(id).exec()
    .then(aspect => resolve(aspect))
    .catch(err => reject(err))
  })
}

export function getByKey(key) {
  return new Promise(function(resolve, reject){
    Aspect.findOne({'key': key}).exec()
    .then(aspect => resolve(aspect))
    .catch(err => reject(err))
  })
}

export function getOutcomes() {
  return new Promise(function(resolve, reject){
    Aspect.find({'type': 'outcome'}).exec()
    .then(aspects => resolve(aspects))
    .catch(err => reject(err))
  })
}
