'use strict';

angular.module('riverApp')
  .factory('PathEditModal', function($rootScope, $uibModal, $q) {
    var openModal = function(conversation, s, p){
      var deferred = $q.defer();
      var stepModal = $uibModal.open({
        animation: true,
        templateUrl: 'app/routes/conversations/view/components/path-modal/path-modal.html',
        controller: 'PathEditModalController',
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        resolve: {
          conversation: () => {
            return conversation;
          },
          index: () => {
            return {
              s: s,
              p: p
            }
          },
        }
      });

      stepModal.result.then(data => {
        deferred.resolve(data)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

      return deferred.promise;
    }

    return {
      open: function(conversation, s, p){
        var deferred = $q.defer();
        openModal(conversation, s, p)
        .then(data => deferred.resolve(data))
        .catch(err => deferred.reject(err))
        return deferred.promise;
      }
    };

  });
