'use strict';
(function(){

angular.module('riverApp')
  .controller('ConversationEditMapController', function($scope, Graph){
    $scope.cellIndex;

    $scope.buildGraph = function() {
      $scope.graph.clear();
      Graph.conversation($scope.$ctrl.conversation)
        .then(data => {
        $scope.graph.addCells(data.cells);
        $scope.cellIndex = data.index;
        var res = joint.layout.DirectedGraph.layout($scope.graph, {
          nodeSep: 50,
          edgeSep: 80,
          rankDir: "TB"
        });
      })
    }

    $scope.setupGraph = function(){
      $scope.graph = new joint.dia.Graph;
      $scope.paper = new joint.dia.Paper({
        el: $('#graph-paper'),
        width: '100%',
        height: 600,
        model: $scope.graph,
        gridSize: 1,
        elementView: Graph.clickableView
      });
      $scope.paper.on('cell:click',
        (cellView, evt, x, y) => {
          $scope.$ctrl.editStep($scope.cellIndex[cellView.model.id])
          $scope.$ctrl.tab.id = 'step';
          $scope.$apply();
        })
      $scope.buildGraph()
    }

  });

})();
