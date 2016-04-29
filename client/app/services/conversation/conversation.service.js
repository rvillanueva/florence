'use strict';

angular.module('riverApp')
  .factory('Conversation', function ($q) {

    var example = {
      _id: 'test',
      info: {
        name: 'Intro'
      },
      steps: [
        {
          _id: '001',
          aliasOfId: 'abc',
          next: {
            action: 'goTo',
            stepId: '002'
          },
          data: {
            _id: 'abc',
            name: 'Welcome',
            measure: null,
            public: false,
            messages: [
              {
                type: 'text',
                text: 'Hi there!'
              }, {
                type: 'text',
                text: 'I\'m River the Robot.'
              }, {
                type: 'text',
                text: 'My purpose...'
              }
            ],
            paths: [
              {
                _id: '003',
                next: {
                  action: 'default'
                },
                data: {
                  name: 'User says hello',
                  patterns: [
                    {
                      type: 'exact',
                      phrases: ['yo', 'hi', 'hey'],
                      messages: [{
                        type: 'text',
                        text: 'Well hey there, you!'
                      },{
                        type: 'text',
                        text:'Glad you\'re doing well today.'
                      }]
                    }
                  ]
                }
              },
              {
                _id: '005',
                next: {
                  action: 'retry'
                },
                data: {
                  name: 'Can\'t understand user',
                  patterns: [
                    {
                      type: 'catch',
                      messages: [{
                        type: 'text',
                        text:'Uh oh, not sure I understood!'
                      }]
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          _id: '002',
          aliasOfId: null,
          next: {
            action: 'end'
          },
          data: {
            name: 'Finish conversation',
            messages: [{
              type: 'text',
              text: 'great, glad to see you too'
            }],
          },
        }
      ]
    };

    var buildMap = function(conversation){
      var index = {};
      var links = {}
      conversation.steps.forEach((step, s) => {
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
        _id: conversation._id,
        info: conversation.info,
        step: index,
        links: links
      }
      return map;
    }

    var buildConvo = function(map){
      var conversation = {
        _id: map._id,
        info: map.info,
        steps: []
      }
      for (var stepId in map.step) {
        if (map.step.hasOwnProperty(property)) {
          var newStep = map.step[stepId];
          delete newStep.path;
          conversation.steps.push(newStep);
        }
      }
      console.log('Built conversation:');
      console.log(conversation);
      return conversation;
    }


    // Public API here
    return {
      getById: function (id) {
        var deferred = $q.defer();
        var map = buildMap(example);
        console.log('Returning conversation map:')
        console.log(map);
        deferred.resolve(map);
        return deferred.promise;
      },
      rebuild: function(map){
        var convo = buildConversation(map);
        return buildMap(convo);
      },
      addPath: function(map, stepId, path){

      },
      addStep: function(map, pathId, step){

      },
      removePath: function(map, pathId){

      },
      removeStep: function(map, removeStep){
      }
    };
  });
