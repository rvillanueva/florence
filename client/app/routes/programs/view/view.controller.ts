'use strict';
(function() {

  class ProgramViewComponent {
    constructor($stateParams, $state, $http, Modal) {
      this.$http = $http;
      this.Modal = Modal;
      this.$http.get('/api/tasks').success(tasks => {
        this.tasks = tasks;
      })
      if(!$stateParams.id){
        $state.go('programs');
      } else {
        this.$http.get('/api/programs/' + $stateParams.id).success(program => {
          if(!program){
            $state.go('programs');
          }
          this.program = program;
          console.log(program)
        })
        .error(err => {
          $state.go('programs');
        })
      }
      var modalOptions = {
        modal: {
          title: 'test',
          html: 'testing',
          buttons:[{
            classes: 'btn-default',
            text: 'Cancel',
            click: null
          },{
            classes: 'btn-primary',
            text: 'Add',
            click: null
          }]
        }
      };
      this.addProtocol = Modal.open(modalOptions, 'modal-default', function(){
        console.log('test')
      })
    }
  }

  angular.module('riverApp')
    .component('programView', {
    templateUrl: 'app/routes/programs/view/view.html',
    controller: ProgramViewComponent
  });
})();
