'use strict';

import Task from '../../models/task/task.model';
import Question from '../../models/question/question.model';

var Promise = require('bluebird');


export function getById(taskId){
  return new Promise(function(resolve, reject){
    Task.findById(taskId).lean().exec()
    .then(task => attachQuestions(task))
    .then(task => resolve(task))
    .catch(err => reject(err))
  })
}


export function attachQuestions(task){
  return new Promise(function(resolve, reject){
    console.log('attaching questions')
    var questionIdArray = [];
    var questionIndex = {};
    task.steps = task.steps || [];
    createQuestionIdArray()
    console.log(questionIdArray)
    Question.find({'_id': {'$in': questionIdArray} })
    .then(questions => {
      createQuestionIndex(questions);
      attachQuestionsFromIndex();
      console.log(task)
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
