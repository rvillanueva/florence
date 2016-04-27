'use strict';
(function(){

class ConversationViewComponent {
  constructor() {
    this.activeStep = 0;
    this.activeSubstep = 0;
    this.script = {
      metadata: 'test',
      steps: [
        {
          id: '001',
          messages: [
            'Hi there!',
            'Hey!',
            'Oh hello'
          ],
          next: 'wait',
          responses: [
            {
              type: 'number',
              min: 0,
              max: 10,
              steps: [
                {
                  id: '002',
                  messages: ['Oh no!'],
                  next: 'continue'
                },
                {
                  id: '003',
                  messages: ['That\'s too bad. Can I help you?'],
                  next: 'wait',
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
        },
        {
          id: '007',
          messages: ['Got it.'],
          next: 'next'
        },
        {
          id: '008',
          messages: ['Goodbye!'],
          next: 'end'
        }
      ]
    };
  }

  edit(step){
    this.editedStep = step;
  }
}

angular.module('riverApp')
  .component('view', {
    templateUrl: 'app/routes/conversations/view/view.html',
    controller: ConversationViewComponent
  });

})();
