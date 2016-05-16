'use strict';
(function(){

angular.module('riverApp')
  .controller('PathEditModalController', function($scope, $uibModalInstance, index, conversation){
    $scope.conversation = angular.copy(conversation);
    $scope.index = index;
    $scope.isPristine = true;
    $scope.savePath = function(){
      $uibModalInstance.close($scope.conversation);
    }
    $scope.cancel = function () {
      var alert = true;
      if(!$scope.isPristine){
        alert = window.confirm('There are unsaved changes. Are you sure you want to quit?')
      }
      if(alert){
        $uibModalInstance.dismiss();
      }
    };
    var pristine = $scope.$watch('conversation', function(newVal, oldVal) {
      if(newVal !== oldVal){
        console.log('Dirtied')
        $scope.isPristine = false;
        pristine();
      }
    }, true);
  });

})();
