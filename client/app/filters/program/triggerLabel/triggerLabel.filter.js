'use strict';

angular.module('florenceApp')
  .filter('triggerLabel', function () {
    return function (protocol) {
      if(protocol.type == 'timed'){
        var str = protocol.params.durationInDays + ' day';
        if(protocol.params.duration > 1){
          str += 's'
        }
        return str;
      } else if (protocol.type == 'recurring'){
        return 'every __ units';
      }
    };
  });
