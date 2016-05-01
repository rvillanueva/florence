'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation, Graph) {
      this.conversation = Conversation;
      this.convo;
      this.cellIndex;
      this.clickEvent = {};

      this.conversation.getById().then(convo => {
        this.convo = convo;
        Graph.conversation(this.convo)
        .then(data => {
          graph.addCells(data.cells);
          this.cellIndex = data.index;
          var res = joint.layout.DirectedGraph.layout(graph, {
              nodeSep: 50,
              edgeSep: 80,
              rankDir: "TB"
          });
      })

      var graph = new joint.dia.Graph;

      var ClickableView = joint.dia.ElementView.extend({
        pointerdown: function () {
          this._click = true;
          joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
        },
        pointermove: function () {
          this._click = false;
          joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
        },
        pointerup: function (evt, x, y) {
          if (this._click) {
            // triggers an event on the paper and the element itself
            this.notify('cell:click', evt, x, y);
          } else {
            joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
          }
        }
      });

      var paper = new joint.dia.Paper({
          el: $('#graph-paper'),
          width: '100%',
          height: 600,
          model: graph,
          gridSize: 1,
          elementView: ClickableView
      });

      paper.on('cell:click',
        (cellView, evt, x, y) => {
          this.openStep(cellView.model.id)
        })

      })

    }

    openStep(cellId){
      console.log(this.cellIndex[cellId])
    }
  }

  angular.module('riverApp')
    .component('view', {
      templateUrl: 'app/routes/conversations/view/view.html',
      controller: ConversationViewComponent
    });
})();
