'use strict';
(function() {

  class TaskViewComponent {
    constructor($stateParams, $state, $http) {
      this.$http = $http;
      this.$stateParams = $stateParams;
      this.newStep = {
        type: 'speech'
      }
      //this.isPristine = true;
      if(!$stateParams.id){
        $state.go('tasks');
      } else {
        this.$http.get('/api/tasks/' + $stateParams.id).success(task => {
          if(!task){
            $state.go('tasks');
          }
          this.task = task;
          //this.isPristine = true;
          console.log(task)
        })
        .error(err => {
          window.alert(err)
        })
      }
    }

    addStep(){
      console.log('adding')
      console.log(this.newStep)
      var addedStep = {
        type: this.newStep.type,
      }
      if(this.newStep.type == 'speech'){
        addedStep.speech = this.newStep.speech;
        this.task.steps.push(addedStep);
        this.newStep = {
          type: 'speech'
        }
      } else if(this.newStep.type == 'question'){
        var newQuestion = this.newStep.question;
        this.$http.post('/api/questions/', newQuestion).success(question => {
          if(!question){
            window.alert('Error: Question was not created.')
          } else {
            console.log(question);
            addedStep.question = question;
            this.task.steps.push(addedStep);
            this.newStep = {
              type: 'question'
            }
          }
        })
      } else {
        window.alert('Error: Step type must be say or ask.')
      }
    }
    saveTask(){
      this.isSaving = true;
      this.$http.put('/api/tasks/' + this.$stateParams.id, this.task).success(task => {
        this.isSaving = false;
      })
      .error(err => {
        this.isSaving = false;
        console.log(err)
        window.alert(err)
      })
    }
  }

  angular.module('riverApp')
    .component('taskView', {
    templateUrl: 'app/routes/tasks/view/view.html',
    controller: TaskViewComponent
  });
})();
