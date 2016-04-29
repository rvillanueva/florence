'use strict';

var example = {
  _id: 'test',
  info: {
    name: 'Intro'
  },
  steps: [
    {
      _id: '001',
      aliasOfId: 'abc',
      next: {
        action: 'goTo',
        stepId: '002'
      },
      data: {
        _id: 'abc',
        name: 'Welcome',
        measure: null,
        public: false,
        messages: [
          {
            type: 'text',
            text: 'Hi there!'
          }, {
            type: 'text',
            text: 'I\'m River the Robot.'
          }, {
            type: 'text',
            text: 'My purpose...'
          }
        ],
        paths: [
          {
            _id: '003',
            next: {
              action: 'default'
            },
            data: {
              name: 'User says hello',
              patterns: [
                {
                  type: 'exact',
                  phrases: ['yo', 'hi', 'hey'],
                  messages: [{
                    type: 'text',
                    text: 'Well hey there, you!'
                  },{
                    type: 'text',
                    text:'Glad you\'re doing well today.'
                  }]
                }
              ]
            }
          },
          {
            _id: '005',
            next: {
              action: 'retry'
            },
            data: {
              name: 'Can\'t understand user',
              patterns: [
                {
                  type: 'catch',
                  messages: [{
                    type: 'text',
                    text:'Uh oh, not sure I understood!'
                  }]
                }
              ]
            }
          }
        ]
      }
    },
    {
      _id: '002',
      aliasOfId: null,
      next: {
        action: 'end'
      },
      data: {
        name: 'Finish conversation',
        messages: [{
          type: 'text',
          text: 'great, glad to see you too'
        }],
      },
    }
  ]
};


export function play(convo){

}

export function answer(convo){

  // get step
  // match pattern;


}
