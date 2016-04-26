'use strict';
(function(){

class ViewComponent {
  constructor($scope) {
    this.counter = 0;
    this.script = {
      metadata: 'test',
      steps: [
        {
          id: '001',
          message: 'Hi there!',
          next: 'wait',
          responses: [
            {
              type: 'number',
              min: 0,
              max: 10,
              steps: [
                {
                  id: '002',
                  message: 'Oh no!',
                  next: 'continue'
                },
                {
                  id: '003',
                  message: 'That\'s too bad. Can I help you?',
                  next: 'wait',
                  responses: [
                    {
                      type: 'entity',
                      entity: 'yesNo',
                      steps: [
                        {
                          id: '004',
                          message: 'Got it!',
                          next: 'goTo',
                          stepId: '005'
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'entity',
              entity: 'yesNo',
              value: 'yes'
            },
            {
              type: 'entity',
              entity: 'yesNo',
              value: 'no'
            },
            {
              type: 'phrase',
              phrases: [
                'Hi'
              ]
            },
            {
              type: 'unknown'
            }
          ]
        }
      ]
    };
    $scope.steps = this.script.steps;
  }

  refreshBranches(response){
    console.log(response)
  }
  test(input){
    console.log(input);
    console.log('fired');
  }
}

angular.module('riverApp')
  .component('view', {
    templateUrl: 'app/routes/scripts/view/view.html',
    controller: ViewComponent
  });

})();
