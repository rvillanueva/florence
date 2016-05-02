'use strict';

angular.module('riverApp')
  .factory('Conversation', function($q, $http) {

    var example = {
      _id: 'test',
      name: 'Intro',
      steps: [{
        _id: '001',
        type: 'messages',
        next: {
          action: 'goTo',
          stepId: '002'
        },
        retries: {
          max: 3,
          replies: ['So really, should I tell you?', 'Do you want to hear the answer or not?']
        },
        name: 'Welcome',
        messages: [{
          type: 'text',
          text: 'Oh hey there!'
        }, {
          type: 'text',
          text: 'I\'m River, and I\'m learning to be a personal care companion.'
        }, {
          type: 'text',
          text: 'Even though I\'m still training, there are a few things I can do. Want to hear them?'
        }, {
          type: 'button',
          buttons: [{
            title: 'Sure, sounds good',
            subtitle: null,
            value: 'yes'
          }, {
            title: 'Uh, no way',
            subtitle: null,
            value: 'no'
          }, {
            title: 'Learning?',
            subtitle: null,
            value: 'learning'
          }]
        }],
        paths: [{
          _id: 'p001',
          next: {
            action: 'default'
          },
          name: 'User accepts',
          button: {
            title: 'Sure, sounds good',
            subtitle: null,
            imgUrl: null,
            messages: [{
              type: 'text',
              text: 'Great!'
            }, {
              type: 'text',
              text: 'Here\'s my magic...'
            }]
          },
          patterns: [{
            type: 'exact',
            phrases: ['yes', 'yea', 'sure'],
            messages: [{
              type: 'text',
              text: 'Great!'
            }, {
              type: 'text',
              text: 'Here\'s my magic...'
            }]
          }]
        }, {
          _id: 'p002',
          next: {
            action: 'goTo',
            stepId: '003'
          },
          name: 'User declines',
          button: {
            title: 'I don\'t think so',
            subtitle: null,
            imgUrl: null,
            messages: [{
              type: 'text',
              text: 'Oh... okay :('
            }]
          },
          patterns: [{
            type: 'exact',
            phrases: ['no', 'no way', 'nah'],
            messages: [{
              type: 'text',
              text: 'You make me sad :('
            }, {
              type: 'text',
              text: 'Fare thee well.'
            }]
          }]
        }, {
          _id: 'p003',
          next: {
            action: 'retry'
          },
          name: 'Can\'t understand user',
          patterns: [{
            type: 'exact',
            phrases: ['you\'re stupid'],
            messages: [{
              type: 'text',
              text: 'So are you, but that doesn\'t answer my question....'
            }]
          }]
        },
        {
          _id: 'p004',
          next: {
            action: 'retry'
          },
          name: 'Asks tangential question',
          button: {
            title: 'Learning?',
            messages: [{
              type: 'text',
              text: 'Haha yeah, I\'m still in Robot School :) None of are perfect yet, sadly'
            }, {
              type: 'text',
              text: 'But as I talk to you, hopefully I\'ll get better at interacting with humans!'
            }]
          }
        }]
      }, {
        _id: '002',
        next: {
          action: 'goTo',
          stepId: '005'
        },
        name: 'Pre-ending',
        messages: [{
          type: 'text',
          text: 'So, I might just seem talkative, but I can also help with a few things'
        }, {
          type: 'text',
          text: 'For instance, I can check in occasionally to help you track your mood or medications'
        }, {
          type: 'text',
          text: 'If it looks like you\'re running into problems, I\'m happy to problem solve with you.'
        }, {
          type: 'text',
          text: 'Just so you know, I\'m not perfect yet... but I do my best to be useful :)'
        }],
      }, {
        _id: '003',
        next: {
          action: 'goTo',
          stepId: '004'
        },
        name: 'Fake finish',
        messages: [{
          type: 'text',
          text: 'Goodbye!'
        }],
      }, {
        _id: '004',
        aliasOfId: null,
        next: {
          action: 'end'
        },
        name: 'Finish conversation',
        messages: [{
          type: 'text',
          text: 'Hah jk lol!'
        }]
      }, {
        _id: '005',
        aliasOfId: null,
        next: {
          action: 'goTo',
          stepId: '007'
        },
        name: 'Ask about options',
        messages: [{
          type: 'text',
          text: 'So, are any of those interesting to you?'
        }],
        paths: [{
          _id: 'p006',
          next: {
            action: 'default'
          },
          name: 'User accepts',
          patterns: [{
            type: 'exact',
            phrases: ['mood', 'tracking'],
            messages: [{
              type: 'text',
              text: 'Sure, let\'s try tracking your mood.'
            }]
          }]
        }]
      }, {
        _id: '007',
        next: {
          action: 'end'
        },
        name: 'End',
        messages: [{
          type: 'text',
          text: 'That\'s it for now, sadly!'
        }]
      }]
    };

    var getConversations = function(){
      var deferred = $q.defer();
      $http.get('/api/conversations').success(function(body){
        console.log(body)
        deferred.resolve(body);
      })
      return deferred.promise;
    }


      // Public API here
    return {
      getById: function(id) {
        var deferred = $q.defer();
        getConversations().then(convos => {
          deferred.resolve(convos[0]);
        })
        return deferred.promise;
      },
      map: function(conversation) {
        var deferred = $q.defer();
        var mapped = buildMap(conversation);
        deferred.resolve(mapped);
        return deferred.promise;
      },
      save: function(conversation) {
        var deferred = $q.defer();
        if(conversation._id){
          $http.put('/api/conversations/' + conversation._id, conversation).success(function(saved){
            deferred.resolve(saved);
          })
        } else {
          $http.post('/api/conversations', conversation).success(function(saved){
            deferred.resolve(saved);
          })
        }
        return deferred.promise;

      }
    };
  });
