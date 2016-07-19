'use strict';
(function() {

  class ProgramViewComponent {
    constructor($stateParams, $state, $http, ModalService) {
      this.$http = $http;
      this.ModalService = ModalService;
      this.protocolTypes = [
        'timed',
        'recurring'
      ];
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
      console.log('Adding protocol...')
      console.log(protocol)
      this.program.protocols = this.program.protocols || [];
      this.program.protocols.push(protocol);
      console.log(this.program)
    }
  }

  angular.module('riverApp')
    .component('programView', {
    templateUrl: 'app/routes/programs/view/view.html',
    controller: ProgramViewComponent
  });
})();
