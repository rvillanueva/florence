'use strict';

angular.module('florenceApp')
  .controller('InstructionItemController', function($scope, ModalService, $http, $window) {
    $scope.selected = false;
    $scope.userId = $scope.$parent.$ctrl.selected.patient._id;

    $scope.entries = [];
    $scope.chart = {
      title: '',
      data: [[]],
      labels: [],
      series: ["Response"],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            type: "time",
            time: {
              format: 'MM/DD HH:mm',
              round: 'hour',
              tooltipFormat: 'll HH:mm',
              unitStepSize: 12,
            },
            scaleLabel: {
              display: false,
              labelString: 'Date'
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              suggestedMax: 5,
              suggestedMin: 0,
              stepSize: 1
            }
          }]
        }
      }
    }
    $scope.toggleExpansion = function() {
      $scope.expanded = !$scope.expanded;
      if ($scope.expanded) {
        $http.get('/api/users/' + $scope.userId + '/entries?instructionId=' + $scope.instruction._id)
          .success(entries => {
            $scope.buildChart(entries);
            $scope.entries = entries;
            console.log($scope.entries);
          })
          .error(err => {
            window.alert(err)
            console.log(err)
          })
      }
    }

    $scope.buildChart = function(entries) {
      $scope.chart.data = [[]];
      $scope.chart.labels = [];
      $scope.chart.labels.push(moment().subtract('1', 'month'));
      $scope.chart.labels.push(moment());
      angular.forEach(entries, (entry, e) => {
        var datapoint = {
          x: new Date(entry.meta.created),
          y: entry.value.number
        }
        $scope.chart.data[0].push(datapoint)
        $scope.chart.title = entry.meta.prompt;
      })
    }
    $scope.edit = function() {
      ModalService.open({
        templateUrl: 'components/modals/editInstruction/editInstruction.html',
        controller: 'EditInstructionModalController as vm',
        params: {
          instruction: $scope.instruction
        }
      })
        .then(instruction => {
          $scope.updateInstruction(instruction);
        })

    }

    $scope.updateInstruction = function(instruction) {
      $http.put('/api/instructions/' + instruction._id, instruction)
        .success(user => {
          $scope.$parent.$ctrl.selected.patient = user;
        })
        .error(err => {
          window.alert(err);
        })
    }
  });
