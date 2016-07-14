'use strict';
(function(){

class TasksComponent {
  constructor($http) {
    this.$http = $http;
    this.$http.get('/api/tasks').success(tasks => {
      this.tasks = tasks;
      console.log(tasks)
    })

  }
}

angular.module('riverApp')
  .component('tasks', {
    templateUrl: 'app/routes/tasks/tasks.html',
    controller: TasksComponent
  });

})();
