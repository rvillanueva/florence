'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation) {
      this.conversation = Conversation;
      this.m; // Step index

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

      this.conversation.getById().then(map => {
        this.m = map;
        this.setActive('001');
      })

    }

    rebuild(map){
      this.conversation.rebuild(map).then(newMap => {
        this.m = newMap;
      })
    }

    setActive(s, p) {
      console.log('Setting active to coords (' + s + ', ' + p + ')')
      this.a.s = s;
      this.a.p = null;
      this.editing.s = s;
      this.editing.p = null;
      this.pathSelection = null;
      if(p){
        this.a.p = p;
        this.editing.p = p;
        this.pathSelection = p;
      } else if(this.m.step[s] && this.m.step[s].data.paths && this.m.step[s].data.paths.length > 0){
        this.a.p = this.m.step[s].data.paths[0]._id;
        this.pathSelection = this.m.step[s].data.paths[0]._id;
      }
      this.buildViewer({
        s: this.a.s,
        p: this.a.p
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
      for (var i = 0; i < 50; i++) {
        if (i == 49 || (done.before && done.after)) {
          return;
        }
        // Add before item
        if(this.m.links[current.before.s] && this.m.links[current.before.s].length > 0){
          var beforeCoords = this.m.links[current.after.s][0];
          if(!beforeCoords.p && this.m.step[beforeCoords.s].data.paths){
            var allPaths = this.m.step[beforeCoords.s].data.paths;
            allPaths.forEach((path, p)=>{
              if(path.next && path.next.action == 'default'){
                beforeCoords.p = path._id;
              }
            })
          }
          current.before = beforeCoords;
          this.viewer.before.push(current.before);
        } else {
          done.before = true;
        }
        // Add after item
        if(current.after.s &&
          this.m.step[current.after.s] &&
          this.m.step[current.after.s].path &&
          this.m.step[current.after.s].path[current.after.p] &&
          this.m.step[current.after.s].path[current.after.p].next.stepId &&
          this.m.step[current.after.s].path[current.after.p].next.action == 'goTo'
        ){
          var afterStepId = this.m.step[current.after.s].path[current.after.p].next.stepId;
          current.after = {
            s: afterStepId,
          }
          if(this.m.step[afterStepId].data.paths && this.m.step[afterStepId].data.paths.length > 0){
            current.after.p = this.m.step[afterStepId].data.paths[0]._id
          }
          this.viewer.after.push(current.after);
        } else if (this.m.step[current.after.s].next.action == 'goTo' && this.m.step[current.after.s].next.stepId){
          var afterStepId = this.m.step[current.after.s].next.stepId;
          current.after = {
            s: afterStepId,
          }
          if(this.m.step[afterStepId].data.paths && this.m.step[afterStepId].data.paths.length > 0){
            current.after.p = this.m.step[afterStepId].data.paths[0]._id
          }
          this.viewer.after.push(current.after);

        } else {
          done.after = true;
        }
      }
    }

    edit(s, p) {
      this.editing = {
        s: s,
        p: p
      };
      console.log(this.editing);

    }

    addPath(stepId){
      // add path here
    }

    setNext(s, p, action){
      if(action == 'goTo'){
        // push path
        console.log('Creating new path')
      } else {
        this.a.p = selection;
        this.buildViewer();
      }
    }
}

  angular.module('riverApp')
    .component('view', {
      templateUrl: 'app/routes/conversations/view/view.html',
      controller: ConversationViewComponent
    });

})();
