'use strict';

import Aspect from './aspect.model';


export function getByKey(key){
  return new Promise(function(resolve, reject){
    Aspect.findOne({'key': key}).exec()
    .then(aspect => resolve(aspect))
    .catch(err => reject(err))
  })
}
