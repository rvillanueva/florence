'use strict';

angular.module('riverApp')
  .factory('Conversation', function ($q) {

    var example = {
      metadata: 'test',
      steps: [
        {
          _id: '001',
          name: 'Welcome',
          messages: ['Hi there!', 'I\'m River the Robot.', 'My purpose...'],
          paths: [
            {
              _id: '003',
              name: 'User says hello',
              patterns: [
                {
                  type: 'exact',
                  phrases: ['yo', 'hi', 'hey'],
                  messages: ['Well hey there, you!','Glad you\'re doing well today.']
                }
              ],
              next: 'goToStep',
              stepId: '002'
            },
            {
              _id: '005',
              name: 'Can\'t understand user',
              patterns: [
                {
                  type: 'unknown',
                  messages: ['Uh oh, not sure I understood!']
                }
              ],
              next: 'retry'
            }
          ]
        },
        {
          _id: '002',
          name: 'Finish conversation',
          messages: ['great, glad to see you too']
        }
      ]
    };

    var stepIndexer = function(steps){
      var index = {};
      var links = {}
      steps.forEach((step, s) => {
        if(step._id && !index[step._id]){
          index[step._id] = step;
          index[step._id].path = {};
          if(step.paths && step.paths.length > 0){
            step.paths.forEach((path, p) => {
              if(path._id && !index[step._id].path[path._id]){
                index[step._id].path[path._id] = path;
                // index linked paths
                if(path.stepId){
                  var coords = {
                    s: step._id,
                    p: path._id
                  }
                  links[path.stepId] = links[path.stepId] || [];
                  links[path.stepId].push(coords);
                }
              } else {
                console.log('Error: No path id')
              }
            })
          }
        } else {
          console.log('Error: No step id')
        }
      })
      var map = {
        index: index,
        links: links
      }
      return map;
    }


    // Public API here
    return {
      getById: function () {
        var deferred = $q.defer();
        var returned = stepIndexer(example.steps);
        returned.conversation = example;
        console.log('Returning conversation map:')
        console.log(returned);
        deferred.resolve(returned);
        return deferred.promise;
      }
    };
  });
