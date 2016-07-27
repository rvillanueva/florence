'use strict';

var Promise = require('bluebird');

import Response from '../../models/response/response.model';

export function create(data){
  var response = data;
  response.meta = {
    created: new Date()
  }
  return Response.create(response);
}

export function getByUserId(userId){
  return new Promise(function(resolve, reject){
    Response.find({'userId':userId})
    .then(responses => resolve(responses))
    .catch(err => reject(err))
  })
}
