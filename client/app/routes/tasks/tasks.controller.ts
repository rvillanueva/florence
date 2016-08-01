'use strict';
(function(){

class TasksComponent {
  constructor($http, $state) {
    this.$http = $http;
    this.$state = $state;
    this.$http.get('/api/tasks').success(tasks => {
      this.tasks = tasks;
      console.log(tasks)
    })

  }
  addTask(){
    console.log('Adding task...')
    var taskName = prompt('What would you like to call your new task?');
    if(taskName){
      var newTask = {
        name: taskName
      }
      this.$http.post('/api/tasks', newTask).success(task => {
        this.$state.go('task-view', {id:task._id})
      })
    }
  }
}

angular.module('florenceApp')
  .component('tasks', {
    templateUrl: 'app/routes/tasks/tasks.html',
    controller: TasksComponent
  });

})();
