'use strict';

angular.module('riverApp')
  .filter('splitPrompt', function (dateFilter) {
    return function (rawText, param, segmentNum) {
      if(typeof rawText !== 'string' || typeof param !== 'string' || (typeof segmentNum !== 'number' && typeof segmentNum !== 'undefined')){
        return 'error'
      }
      var text = rawText;
      segmentNum = segmentNum || 0;
      var segmentArray = [];
      var loopEnded = false;
      for (var i = -1; i < segmentNum; i++){
        var paramStartLoc = text.indexOf('<<' + param + '>>');
        if(paramStartLoc > -1){
          var segment = text.slice(0, paramStartLoc);
          segmentArray.push(segment);
          text = text.slice(paramStartLoc + param.length + 4, text.length);
        } else if(!loopEnded){
          segmentArray.push(text)
          loopEnded = true;
        }
      }
      if(segmentNum < segmentArray.length){
        return segmentArray[segmentNum];
      } else {
        return null;
      }

    };
  });
