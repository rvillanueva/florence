'use strict';
(function() {

  class ConversationViewComponent {
    constructor(Conversation, Graph, $uibModal) {
      this.conversationService = Conversation;
      this.graphService = Graph;
      this.conversation;
      this.cellIndex;
      this.clickEvent = {};
      this.editor = $uibModal;

      this.conversationService.getById().then(convo => {
        this.conversation = convo;
        this.buildGraph(this.conversation);
      })

      this.graph = new joint.dia.Graph;

      this.paper = new joint.dia.Paper({
        el: $('#graph-paper'),
        width: '100%',
        height: 600,
        model: this.graph,
        gridSize: 1,
        elementView: this.graphService.clickableView
      });

      this.paper.on('cell:click',
        (cellView, evt, x, y) => {
          this.editStep(this.cellIndex[cellView.model.id])
        })

    }
    buildGraph(convo) {
      console.log('Updated:')
      console.log(convo)
      this.conversation = convo;
      this.graph.clear();
      this.graphService.conversation(convo)
        .then(data => {
        this.graph.addCells(data.cells);
        this.cellIndex = data.index;
        var res = joint.layout.DirectedGraph.layout(this.graph, {
          nodeSep: 50,
          edgeSep: 80,
          rankDir: "TB"
        });
      })
    }
    editStep(stepId) {
      console.log(stepId);
      this.graphService.editStep(this.conversation, stepId)
        .then(conversation => this.conversationService.save(conversation))
        .then(saved => this.buildGraph(saved))
        .catch(err => console.log(err))
    };
  }

  angular.module('riverApp')
    .component('view', {
    templateUrl: 'app/routes/conversations/view/view.html',
    controller: ConversationViewComponent
  });
})();
