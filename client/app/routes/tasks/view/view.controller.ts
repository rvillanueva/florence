'use strict';
(function() {

  class TaskViewComponent {
    constructor($stateParams, $state, $http, $scope, $q) {
      this.$http = $http;
      this.$q = $q;
      this.$stateParams = $stateParams;
      this.$scope = $scope;

      this.isPristine = true;
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
          this.setPristine();
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
      this.$http.put('/api/tasks/' + this.$stateParams.id, this.task).success(task => {
        this.task = task;
        this.setPristine();
      })
      .error(err => {
        console.log(err)
        window.alert(err)
      })
    }
    setPristine(){
      console.log('Page is pristine.');
      this.isPristine = true;
      this.pristineWatcher = this.$scope.$watch(() => this.task, (oldVal, newVal) => {
        if(newVal !== oldVal){
          console.log('Dirtied.')
          this.isPristine = false;
          this.pristineWatcher();
        }
      },true);
    }
    deleteStep(s){
      var confirmed = window.confirm('Are you sure you want to delete this step?')
      if(confirmed){
        this.task.steps.splice(s, 1);
      }
    }
    queryQuestions(term){
      console.log(term)
      var deferred = this.$q.defer();
      this.$http.get('/api/questions/query?term=' + term).success(results => {
        console.log(results)
        deferred.resolve(results)
      })
      .error(err => {
        console.log(err)
        deferred.reject(err)
      })
      return deferred.promise;
    }
    addSelectedQuestion(question){
      console.log(question)
      this.task.steps.push({
        type: 'question',
        question: question
      })
      this.newStep.question.text = ''
    }

  }

  angular.module('florenceApp')
    .component('taskView', {
    templateUrl: 'app/routes/tasks/view/view.html',
    controller: TaskViewComponent
  });
})();
