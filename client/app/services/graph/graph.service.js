'use strict';

angular.module('riverApp')
  .factory('Graph', function($q, $uibModal) {
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
        var stepText =  step.name || step._id;
        if(step.messages && step.messages[0] && step.messages[0].text){
          var string = step.messages[0].text;
          if(string.length > 30){
            stepText = '\"' + string.slice(0,30) + '...' + '\"';
          } else {
            stepText = '\"' + string + '\"';
          }
        }
        var rect = new joint.shapes.basic.Rect({
          position: {
            x: 100,
            y: 30
          },
          size: {
            width: 200,
            height: 40
          },
          attrs: {
            rect: {
              fill: '#22b573',
              'stroke':  'none'
            },
            text: {
              text: stepText,
              'font-size': 11,
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
          },
          attrs:{
            '.connection': { stroke: '#363636' },
            '.marker-target': { fill: '#363636', d: 'M 10 0 L 0 5 L 10 10 z', stroke: 'none' }
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

    var ClickableView = joint.dia.ElementView.extend({
      pointerdown: function () {
        this._click = true;
        joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
      },
      pointermove: function () {
        this._click = false;
        joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
      },
      pointerup: function (evt, x, y) {
        if (this._click) {
          // triggers an event on the paper and the element itself
          this.notify('cell:click', evt, x, y);
        } else {
          joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
        }
      }
    });

    var openStepModal = function(conversation, stepId){
      var deferred = $q.defer();
      var stepModal = $uibModal.open({
        animation: true,
        templateUrl: 'components/modals/step-editor/step-editor.html',
        controller: 'StepEditorModalController',
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          conversation: () => {
            return conversation;
          },
          stepId: () => {
            return stepId;
          }
        }
      });

      stepModal.result.then(data => {
        deferred.resolve(data)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

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
      },
      editStep: function(conversation, stepId){
        var deferred = $q.defer();
        openStepModal(conversation, stepId)
        .then(data => deferred.resolve(data))
        .catch(err => deferred.reject(err))
        return deferred.promise;
      },
      clickableView: function(){
        return ClickableView;
      }
    };
  });
