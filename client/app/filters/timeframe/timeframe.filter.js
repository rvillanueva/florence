'use strict';

angular.module('riverApp')
  .filter('timeframe', function (dateFilter) {
    return function (timeframe) {
      timeframe = timeframe || {};
      console.log(timeframe);
      if(!timeframe.to && timeframe.from){
        return 'after ' + dateFilter(timeframe.from)
      } else if (timeframe.from && !timeframe.to){
        return 'before ' + dateFilter(timeframe.to)
      } else if(timeframe.to && timeframe.from){
        return 'from ' + dateFilter(timeframe.from) + ' to ' + dateFilter(timeframe.to);
      } else {
        return null;
      }
    };
  });
