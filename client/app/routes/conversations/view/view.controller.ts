'use strict';
(function() {

  class ConversationViewComponent {
    constructor() {
      this.newMessage = {
        source: 'app',
        text: ''
      }
      this.conversation = {
        metadata: 'test',
        steps: [
          {
            _id: '001',
            messages: ['hi 1', 'hi 2', 'hi 3'],
            paths: [
              {
                _id: '003',
                patterns: [
                  {
                    type: 'phrase',
                    phrases: ['yo,', 'hi', 'hey'],
                    messages: ['Well hey there, you!']
                  }
                ],
                next: 'goToStep',
                stepId: '002'
              }
            ]
          },
          {
            _id: '002',
            messages: ['great, glad to see you too'],
            paths: [
              {
                patterns: [
                  {
                    type: 'phrase',
                    phrases: ['yo', 'hi', 'hey'],
                    messages: ['Well hey there, you!']
                  }
                ],
                next: 'end',
              }
            ]
          }
        ]
      }

      this.script = {
        before: [],
        active: {},
        after: []
      }

      this.setActive('001');

    }


    getStep(stepId) {
      for (var i = 0; i < this.conversation.steps.length; i++) {
        var step = this.conversation.steps[i];
        if (stepId == step._id) {
          return step;
        }
      }
    }

    getPath(step, pathId) {
      step.paths = step.paths || [];
      for (var i = 0; i < step.paths.length; i++) {
        var path = step.paths[i];
        if (pathId == path._id) {
          return path;
        }
      }
    }

    setActive(stepId) {
      var step = this.getStep(stepId);
      this.script.active = {
        step: step,
        pathIndex: 0
      }
      this.buildScript(this.script.active);
      console.log(this.script);
      // If not already the active step, get step by Id
      // Take step, set default path based on most frequent path,
      // cycle for 4 more steps
    }

    buildScript(block) {
      this.buildAfter(this.script.active);
      this.buildBefore(this.script.active);
    }

    buildAfter(block) {
      this.script.after = [];
      var lastBlock = block;
      var nextBlock;
      for (var i = 0; i < 100; i++) {
        nextBlock = this.selectNextAfterBlock(lastBlock);
        if (i == 99) {
          console.log('Timed out after 100 iterations.')
          return;
        }
        if (!nextBlock) {
          return;
        }
        this.script.after.push(nextBlock);
        lastBlock = nextBlock;
        nextBlock = null;
      }
    }

    buildBefore(block) {
      this.script.before = [];
      var lastBlock = block;
      var nextBlock;
      for (var i = 0; i < 100; i++) {
        nextBlock = this.selectNextBeforeBlock(lastBlock);
        if (i == 99) {
          console.log('Timed out after 100 iterations.')
          return;
        }
        if (!nextBlock) {
          console.log('No more blocks.')
          return;
        }
        this.script.before.splice(0, 0, nextBlock);
        lastBlock = nextBlock;
        nextBlock = null;
      }
    }

    selectNextAfterBlock(block) {
      var nextBlock = {
        step: null,
        pathIndex: null
      }
      var nextStepId;
      console.log(block)
      if (
        block.step &&
        typeof block.pathIndex == 'number' &&
        block.step.paths &&
        block.step.paths[block.pathIndex] &&
        block.step.paths[block.pathIndex].next == 'goToStep'
      ){
        nextStepId = block.step.paths[block.pathIndex].stepId
        if (!nextStepId) {
          console.log('Error: No stepId associated with goToStep for ' + step._id);
          return false;
        }
        nextBlock.step = this.getStep(nextStepId);
        if (nextBlock.step.paths) {
          nextBlock.pathIndex = 0;
        } else {
          nextBlock.pathIndex = false;
        }
        return nextBlock;
      }
      return false;
    }

    selectNextBeforeBlock(block) {
      var nextBlock = {
        step: null,
        pathIndex: null
      }
      var nextStepId;
      for (var i = 0; i < this.conversation.steps.length; i++) {
        var step = this.conversation.steps[i];
        for (var j = 0; j < step.paths.length; j++) {
          var path = step.paths[j];
          if (path && path.stepId == block.step._id) {
            nextBlock.step = step;
            nextBlock.pathIndex = j;
            return nextBlock;
          }
        }
      }
      return false;
    }

    getBestPath(stepMap) {
      if (stepMap.paths) {
        return stepMap.paths[0]._id;
      } else {
        return false;
      }
    }


    edit(step) {
      this.editedStep = step;
    }
}

  angular.module('riverApp')
    .component('view', {
      templateUrl: 'app/routes/conversations/view/view.html',
      controller: ConversationViewComponent
    });

})();
