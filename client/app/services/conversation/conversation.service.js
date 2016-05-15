'use strict';

angular.module('riverApp')
  .factory('Conversation', function($q, $http) {

    var getAll = function(){
      var deferred = $q.defer();
      $http.get('/api/conversations').success(function(convos){
        deferred.resolve(convos);
      })
      return deferred.promise;
    }

    var getById = function(id){
      var deferred = $q.defer();
      if(!id){
        deferred.reject('Need id to get conversation.')
      }
      $http.get('/api/conversations/' + id).success(function(convo){
        deferred.resolve(convo);
      })
      return deferred.promise;
    }


      // Public API here
    return {
      getAll: function(id) {
        var deferred = $q.defer();
        getAll().then(convos => {
          deferred.resolve(convos);
        })
        return deferred.promise;
      },
      getById: function(id) {
        var deferred = $q.defer();
        getById(id).then(convo => {
          deferred.resolve(convo);
        })
        return deferred.promise;
      },
      save: function(conversation) {
        var deferred = $q.defer();
        if(!conversation._id){
          deferred.reject()
        }
          $http.put('/api/conversations/' + conversation._id, conversation).success(function(saved){
            deferred.resolve(saved);
          })
        return deferred.promise;

      },
      create: function(conversation) {
        var deferred = $q.defer();
        $http.post('/api/conversations', conversation).success(function(saved){
          deferred.resolve(saved);
        })
        return deferred.promise;
      }
    };
  });
