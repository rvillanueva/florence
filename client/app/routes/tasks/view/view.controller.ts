'use strict';
(function() {

  class TaskViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
      this.newStep = {
        type: 'speech'
      }
      if(!$stateParams.id){
        $state.go('tasks');
      } else {
        this.$http.get('/api/tasks/' + $stateParams.id).success(task => {
          if(!task){
            $state.go('tasks');
          }
          this.task = task;
          console.log(task)
        })
        .error(err => {
          $state.go('tasks');
        })
      }
    }
  }

  angular.module('riverApp')
    .component('taskView', {
    templateUrl: 'app/routes/tasks/view/view.html',
    controller: TaskViewComponent
  });
})();
