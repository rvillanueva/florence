'use strict';

import Metric from './metric.model';


export function getById(id){
  return new Promise(function(resolve, reject){
    Metric.findById(id).exec()
    .then(aspect => resolve(aspect))
    .catch(err => reject(err))
  })
}
