/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/tasks              ->  index
 * POST    /api/tasks              ->  create
 * GET     /api/tasks/:id          ->  show
 * PUT     /api/tasks/:id          ->  update
 * DELETE  /api/tasks/:id          ->  destroy
 */

'use strict';

var Promise = require('bluebird');
import _ from 'lodash';
import Task from '../../models/task/task.model';
import Question from '../../models/question/question.model';

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
    entity.steps = [];
    console.log(entity.steps)
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

function attachQuestions(task){
  return new Promise(function(resolve, reject){
    console.log('attaching questions')
    var questionIdArray = [];
    var questionIndex = {};
    task.steps = task.steps || [];
    createQuestionIdArray()
    Question.find({'_id': {'$in': questionIdArray} })
    .then(questions => {
      createQuestionIndex(questions);
      attachQuestionsFromIndex();
      resolve(task);
    })
    .catch(err => reject(err))

    function createQuestionIdArray(){
      task.steps.forEach(function(step, s){
        if(step.type == 'question'){
          questionIdArray.push(step.questionId)
        }
      })
    }

    function createQuestionIndex(questions){
      questions.forEach(function(question, q){
        questionIndex[question._id] = question;
      })

    }

    function attachQuestionsFromIndex(){
      task.steps.forEach(function(step, s){
        if(step.type == 'question'){
          step.question = questionIndex[step.questionId];
          delete step.questionId;
        }
      })
    }

  })

}

// Gets a list of Tasks
export function index(req, res) {
  return Task.find({}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Task from the DB
export function show(req, res) {
  return Task.findById(req.params.id).lean().exec()
    .then(task => attachQuestions(task))
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Task in the DB
export function create(req, res) {
  return Task.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Task in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  var task = req.body;
  task.steps = task.steps || [];
  task.steps.forEach(function(step, s){
    if(step.type == 'question'){
      step.questionId = step.question._id;
      delete step.question;
    }
  })
  console.log(task)
  return Task.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(task => attachQuestions(task))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Task from the DB
export function destroy(req, res) {
  return Task.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
