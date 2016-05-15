'use strict';
(function() {

  class IntentsViewComponent {
    constructor(Intent, $stateParams, $state, $scope) {
      console.log('Loaded')
      this.intentService = Intent;
      this.$scope = $scope;
      this.isPristine;
      this.watcher;
      this.map = {};
      this.intents = {};
      if(!$stateParams.id){
        $state.go('intents');
      } else {
        this.intentService.getById($stateParams.id).then(intent => {
          if(!intent){
            $state.go('conversations');
          }
          console.log(intent)
          this.intent = intent;
          this.isPristine = true;
          this.setWatcher();

        })
      }
    }

    save(updated){
      updated = updated || this.intent;
      this.intentService.save(updated).then(intent => {
        this.intent = intent;
        this.isPristine = true;
        this.setWatcher();
      })
    }

    setWatcher(){
      this.watcher = this.$scope.$watch('$ctrl.intent', (newVal, oldVal) => {
        if(newVal !== oldVal){
          console.log('Dirtied')
          this.isPristine = false;
          this.watcher();
        }
      }, true);
    }

  }

  angular.module('riverApp')
    .component('intentsView', {
    templateUrl: 'app/routes/intents/view/view.html',
    controller: IntentsViewComponent
  });
})();
