'use strict';
(function(){

angular.module('riverApp')
  .controller('ConversationEditMapController', function($scope){

  });

})();


angular.module('riverApp')
  .controller('ConversationLineController', function($scope){
    $scope.hidden = false;
    $scope.toggleHidden = function(){
      $scope.hidden = !$scope.hidden;
    }
  });
