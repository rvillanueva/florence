'use strict';

angular.module('riverApp')
  .filter('timeframe', function (dateFilter) {
    return function (timeframe) {
      timeframe = timeframe || {};
      console.log(timeframe);
      if(!timeframe.to && timeframe.from){
        return 'before ' + dateFilter(timeframe.from)
      } else if (timeframe.to && !timeframe.from){
        return 'after ' + dateFilter(timeframe.to)
      } else if(timeframe.to && timeframe.from){
        return 'from ' + dateFilter(timeframe.to) + ' to ' + dateFilter(timeframe.from);
      } else {
        return 'error';
      }
    };
  });
