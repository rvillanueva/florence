'use strict';
(function() {

  class ConversationViewComponent {
    constructor() {
      this.conversation = {
        metadata: 'test',
        steps: [
          {
            _id: '001',
            messages: ['Hi there!', 'I\'m River the Robot.', 'My purpose...'],
            paths: [
              {
                _id: '003',
                patterns: [
                  {
                    type: 'phrase',
                    phrases: ['yo', 'hi', 'hey'],
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
            messages: ['great, glad to see you too']
          }
        ]
      }

      this.step; // Step index
      this.stepLinks;

      this.viewer = {
        before: [],
        after: []
      }
      this.s;
      this.p;
      this.editing = {};

      this.compileIndex(this.conversation.steps)

      this.setActive('001');
    }

    compileIndex(steps){
      if(this.step){
        console.log('Already compiled.')
        return;
      }
      this.step = {};
      this.stepLinks = {}
      steps.forEach((step, s) => {
        if(step._id && !this.step[step._id]){
          this.step[step._id] = step;
          this.step[step._id].path = {};
          if(step.paths && step.paths.length > 0){
            step.paths.forEach((path, p) => {
              if(path._id && !this.step[step._id].path[path._id]){
                this.step[step._id].path[path._id] = path;
                // index linked paths
                if(path.stepId){
                  var coords = {
                    s: step._id,
                    p: path._id
                  }
                  this.stepLinks[path.stepId] = this.stepLinks[path.s] || [];
                  this.stepLinks[path.stepId].push(coords);
                }
              } else {
                console.log('Error: No path id')
              }
            })
          }
        } else {
          console.log('Error: No step id')
        }
      })
      console.log('Done building step index:')
      console.log(this.step);
      console.log(this.stepLinks)
    }

    getStep(s) {
      if(!this.step[s]){
        console.log('Error: No step indexed with id ' + stepId);
        return false;
      }
      return this.step[s];
    }

    getPath(s, p) {
      if(!this.step[s].path[p]){
        console.log('Error: No path indexed with coordinates ' + stepId + ', ' + pathId);
        return false;
      }
      return this.step[s].path[p];

    }

    setActive(s, p) {
      console.log('Setting to (' + s + ', ' + p + ')')
      this.s = s;
      this.p = null;
      this.editing.s = s;
      this.editing.p = null;
      if(p){
        this.p = p;
        this.editing.p = p;
      }
      if(this.step[s] && this.step[s].paths && this.step[s].paths.length > 0){
        this.p = this.step[s].paths[0]._id;
      }
      this.buildViewer({
        s: this.s,
        p: this.p
      });
      // If not already the active step, get step by Id
      // Take step, set default path based on most frequent path,
      // cycle for 4 more steps
    }

    buildViewer(block) {
      console.log(block)
      this.viewer.before = [];
      this.viewer.after = [];
      var current = {
        before: block,
        after: block
      }
      var done = {
        before: false,
        after: false
      };
      for (var i = 0; i < 100; i++) {
        if (i == 99 || (done.before && done.after)) {
          return;
        }
        // Add before item
        if(this.stepLinks[current.before.s] && this.stepLinks[current.before.s].length > 0){
          current.before = this.stepLinks[current.after.s][0];
          this.viewer.before.push(current.before);
        } else {
          done.before = true;
        }
        // Add after item
        if(current.after.s &&
          this.step[current.after.s] &&
          this.step[current.after.s].paths &&
          this.step[current.after.s].paths.length > 0 &&
          this.step[current.after.s].paths[0].stepId
        ){
          var afterStepId = this.step[current.after.s].paths[0].stepId;
          current.after = {
            s: afterStepId,
          }
          if(this.step[afterStepId].paths && this.step[afterStepId].paths.length > 0){
            current.after.p = this.step[afterStepId].paths[0]._id
          }
          if(current.after.s){
            this.viewer.after.push(current.after);
          }
        } else {
          done.after = true;
        }
      }
    }

    getBestPath(stepMap) {
      if (stepMap.paths) {
        return stepMap.paths[0]._id;
      } else {
        return false;
      }
    }

    edit(s, p) {
      this.editing = {
        s: s,
        p: p
      };
      console.log(this.editing);

    }
}

  angular.module('riverApp')
    .component('view', {
      templateUrl: 'app/routes/conversations/view/view.html',
      controller: ConversationViewComponent
    });

})();
