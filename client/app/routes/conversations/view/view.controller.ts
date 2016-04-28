'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation) {
      this.convoService = Conversation;
      this.step; // Step index
      this.stepLinks;

      this.viewer = {
        before: [],
        after: []
      }
      this.a = {
        s: null,
        p: null,
        active: true
      };
      this.editing = {};

      this.convoService.getById().then(map => {
        this.conversation = map.conversation;
        this.step = map.index;
        this.stepLinks = map.links;
        this.setActive('001');
      })

    }

    setActive(s, p) {
      console.log('Setting active to coords (' + s + ', ' + p + ')')
      this.a.s = s;
      this.a.p = null;
      this.editing.s = s;
      this.editing.p = null;
      if(p){
        this.a.p = p;
        this.editing.p = p;
      }
      if(this.step[s] && this.step[s].paths && this.step[s].paths.length > 0){
        this.a.p = this.step[s].paths[0]._id;
      }
      this.buildViewer({
        s: s,
        p: p
      });
      // If not already the active step, get step by Id
      // Take step, set default path based on most frequent path,
      // cycle for 4 more steps
    }

    buildViewer(block) {
      block = block || this.a;
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
          this.step[current.after.s].paths[0].stepId &&
          this.step[current.after.s].paths[0].next
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
