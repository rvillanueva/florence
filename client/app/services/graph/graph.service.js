'use strict';

angular.module('riverApp')
  .factory('Graph', function($q) {
    // Service logic
    // ...
    var buildLinks = function(conversation) {
      var steps = [];
      var links = [];
      var returned = {};
      conversation.steps.forEach(function(step, s) {
        var index = {};
        if (step.next && step.next.action == 'goTo' && step.next.stepId) {
          links.push({
            source: {
              stepId: step._id
            },
            target: {
              stepId: step.next.stepId
            }
          })
          index[step.next.stepId] = true;
        }
        if(step.paths) {
          step.paths.forEach(function(path, p) {
            if (path.next && path.next.action == 'goTo' && path.next.stepId && !index[path.next.stepId]) {
              links.push({
                source: {
                  stepId: step._id
                },
                target: {
                  stepId: path.next.stepId
                }
              })
            }
          })
        }
      })
      console.log(links);
      return links;
    }

    var graphConversation = function(convo) {
      var deferred = $q.defer();
      var returned = {};
      var cells = [];
      var links = buildLinks(convo)
      var index = {};
      var cellIndex = {};
      convo.steps.forEach(function(step, s) {
        var stepText = step.name || step._id;
        var rect = new joint.shapes.basic.Rect({
          position: {
            x: 100,
            y: 30
          },
          size: {
            width: 170,
            height: 60
          },
          attrs: {
            rect: {
              fill: '#2e9c56'
            },
            text: {
              text: stepText,
              fill: 'white'
            }
          }
        });
        index[step._id] = rect;
        cellIndex[rect.id] = step._id;
        cells.push(rect);
      })
      links.forEach(function(link, l) {
        var link = new joint.dia.Link({
          source: {
            id: index[link.source.stepId].id
          },
          target: {
            id: index[link.target.stepId].id
          }
        });
        cells.push(link);
      })
      returned = {
        cells: cells,
        index: cellIndex
      }
      deferred.resolve(returned);
      return deferred.promise;
    }

    // Public API here
    return {
      conversation: function(convo) {
        var deferred = $q.defer();
        graphConversation(convo)
          .then(data => deferred.resolve(data))
          .catch(err => deferred.reject(err))
        return deferred.promise;
      }
    };
  });
