/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/verify              ->  index
 * POST    /api/verify              ->  create
 * GET     /api/verify/:id          ->  show
 * PUT     /api/verify/:id          ->  update
 * DELETE  /api/verify/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Verification from './verification.model';
import * as Verify from '../../auth/verify';
import * as Auth from '../../auth/auth.service';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.save()
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Verifications
export function verify(req, res) {
    req.query = req.query || {};
    var userId = req.query.userId;
    var token = req.query.token;
    return Verify.checkVerification(userId, token)
    .then(user => {
        if(!user){
          console.log('Token does not match userId.')
          return res.status(403).send('Token does not match userId.')
        }
        req.user = user;
        Auth.setTokenCookie(req, res);
    })
    .catch(handleError(res));
}
