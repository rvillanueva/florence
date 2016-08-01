'use strict';
(function() {

  class ProgramViewComponent {
    constructor($stateParams, $state, $http, ModalService) {
      this.$http = $http;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.ModalService = ModalService;
      this.protocolTypes = [
        'timed',
        'recurring'
      ];
      this.$http.get('/api/tasks').success(tasks => {
        this.tasks = tasks;
      })
      if(!this.$stateParams.id){
        this.$state.go('programs');
      } else {
        this.$http.get('/api/programs/' + this.$stateParams.id).success(program => {
          if(!program){
            this.$state.go('programs');
          }
          this.program = program;
          console.log(program)
        })
        .error(err => {
          this.$state.go('programs');
        })
      }
    }
    openProtocolModal(protocolType){
      this.ModalService.open({
        templateUrl: 'components/modals/addProtocol/addProtocol.html',
        controller: 'AddProtocolModalController as vm',
        params: {
          protocolType: protocolType
        }
      })
      .then(newProtocol => {
        this.addProtocol(newProtocol);
      })
    }
    addProtocol(protocol){
      this.program.protocols = this.program.protocols || [];
      this.program.protocols.push(protocol);
      console.log(this.program)
    }
    saveProgram(){
      console.log('Saving...')
      this.$http.put('/api/programs/' + this.$stateParams.id, this.program).success(program => {
        this.program = program;
        console.log(program)
      })
      .error(err => {
        window.alert(err)
      })
    }
  }

  angular.module('florenceApp')
    .component('programView', {
    templateUrl: 'app/routes/programs/view/view.html',
    controller: ProgramViewComponent
  });
})();
