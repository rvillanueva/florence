'use strict';

angular.module('florenceApp')
  .factory('ModalService', function ($uibModal, $q) {

    var openModal = function(options){
      var deferred = $q.defer();
      var newModal = $uibModal.open({
        animation: options.animation || true,
        templateUrl: options.templateUrl,
        controller: options.controller,
        size: options.size || 'lg',
        backdrop: options.backdrop || 'static',
        keyboard: options.keyboard || false,
        resolve: {
          params: () => {
            return options.params;
          }
        }
      });

      newModal.result.then(data => {
        deferred.resolve(data)
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });

      return deferred.promise;
    }

    return {
      open: openModal
    };
  });
