'use strict';
(function() {

  class AddProtocolModalComponent {
    constructor($uibModalInstance, $q, $http, params) {
      this.$http = $http;
      this.$q = $q;
      this.protocol = {
        type: params.protocolType,
        params: {
          durationInDays: null
        }
      }
      this.$uibModalInstance = $uibModalInstance;
    }
    done(){
      this.$uibModalInstance.close(this.protocol)
    }
    searchTasks(){
      var deferred = this.$q.defer();
      this.$http.get('/api/tasks').success(tasks => {
        deferred.resolve(tasks)
      })
      .error(err => {
        console.log(err)
        deferred.reject(err)
      })
      return deferred.promise;
    }
    addTask(task){
      this.protocol.task = task;
      this.addedTask = '';
    }
  }

  angular.module('florenceApp')
    .controller('AddProtocolModalController', AddProtocolModalComponent);
})();
