/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/parse              ->  index
 * POST    /api/parse              ->  create
 * GET     /api/parse/:id          ->  show
 * PUT     /api/parse/:id          ->  update
 * DELETE  /api/parse/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';

var ParserService = require('../../services/parser')

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
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

// Gets a list of Parses
export function parse(req, res) {
  return ParserService.classify(req.query)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
