'use strict';
(function() {

  class ConversationViewComponent {
    constructor() {
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
            messages: ['great, glad to see you too']
          }
        ]
      }

      this.step; // Step index
      this.stepLinks;

      this.viewer = {
        before: [],
        active: {},
        after: []
      }
      this.s;
      this.p;
      
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
                    stepId: step._id,
                    pathId: path._id
                  }
                  this.stepLinks[path.stepId] = this.stepLinks[path.stepId] || [];
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

    getStep(stepId) {
      if(!this.step[stepId]){
        console.log('Error: No step indexed with id ' + stepId);
        return false;
      }
      return this.step[stepId];
    }

    getPath(stepId, pathId) {
      if(!this.step[stepId].path[pathId]){
        console.log('Error: No path indexed with coordinates ' + stepId + ', ' + pathId);
        return false;
      }
      return this.step[stepId].path[pathId];

    }

    setActive(stepId, pathId) {
      console.log('Setting to (' + stepId + ', ' + pathId + ')')
      this.viewer.active = {
        stepId: null,
        pathId: null
      }
      this.viewer.active.stepId = stepId;
      if(pathId){
        this.viewer.active.pathId = pathId;
      }
      if(this.step[stepId] && this.step[stepId].paths && this.step[stepId].paths.length > 0){
        this.viewer.active.pathId = this.step[stepId].paths[0]._id;
      }
      this.buildViewer(this.viewer.active);
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
        if(this.stepLinks[current.before.stepId] && this.stepLinks[current.before.stepId].length > 0){
          current.before = this.stepLinks[current.after.stepId][0];
          this.viewer.before.push(current.before);
        } else {
          done.before = true;
        }
        // Add after item
        if(current.after.stepId &&
          this.step[current.after.stepId] &&
          this.step[current.after.stepId].paths &&
          this.step[current.after.stepId].paths.length > 0 &&
          this.step[current.after.stepId].paths[0].stepId
        ){
          current.after = this.step[current.after.stepId].paths[0];
          this.viewer.after.push(current.after);
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
