'use strict';

angular.module('riverApp')
  .factory('Intent', function($q, $http) {

    var getAll = function() {
      var deferred = $q.defer();
      $http.get('/api/intents').success(function(intents) {
        deferred.resolve(intents);
      })
      return deferred.promise;
    }

    var getById = function(id) {
      var deferred = $q.defer();
      if (!id) {
        deferred.reject('Need id to get intent.')
      }
      $http.get('/api/intents/' + id).success(function(intent) {
        deferred.resolve(intent);
      })
      return deferred.promise;
    }


    // Public API here
    return {
      getAll: function(id) {
        var deferred = $q.defer();
        getAll().then(intents => {
          deferred.resolve(intents);
        })
        return deferred.promise;
      },
      getById: function(id) {
        var deferred = $q.defer();
        getById(id).then(intent => {
          deferred.resolve(intent);
        })
        return deferred.promise;
      },
      save: function(intent) {
        var deferred = $q.defer();
        if (!intent._id) {
          deferred.reject()
        }
        $http.put('/api/conversations/' + intent._id, intent).success(function(saved) {
          deferred.resolve(saved);
        })
        return deferred.promise;

      },
      create: function(intent) {
        var deferred = $q.defer();
        $http.post('/api/conversations', intent).success(function(saved) {
          deferred.resolve(saved);
        })
        return deferred.promise;
      }
    };
  });
