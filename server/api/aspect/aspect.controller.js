/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/aspects              ->  index
 * POST    /api/aspects              ->  create
 * GET     /api/aspects/:id          ->  show
 * PUT     /api/aspects/:id          ->  update
 * DELETE  /api/aspects/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Aspect from './aspect.model';
import Metric from '../metric/metric.model';

function attachMetrics(res) {
  return function(aspects) {
    return new Promise(function(resolve, reject){
      if (aspects) {
        var aspectKeys = [];
        aspects.forEach(function(aspect, a){
          aspectKeys.push(aspect.key)
        });
        Metric.find({'aspect': {
          $in: aspectKeys
        }}).exec()
        .then(metrics => {
          if(metrics){
            aspects.forEach(function(aspect, a){
              aspect.metrics = [];
              metrics.forEach(function(metric, m){
                if(metric.aspect == aspect.key){
                  aspect.metrics.push(metric);
                }
              })
            })
          }
          resolve(aspects)
        })
      } else {
        resolve(false)
      }
    })
  };
}


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

// Gets a list of Aspects
export function index(req, res) {
  return Aspect.find().lean().exec()
    .then(attachMetrics(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Aspect from the DB
export function show(req, res) {
  return Aspect.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Aspect in the DB
export function create(req, res) {
  return Aspect.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Aspect in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Aspect.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Aspect from the DB
export function destroy(req, res) {
  return Aspect.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
