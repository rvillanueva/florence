'use strict';

angular.module('riverApp')
  .filter('triggerLabel', function () {
    return function (trigger) {
      if(trigger.type == 'timed'){
        var str = trigger.params.duration + ' ' + trigger.params.durationUnit;
        if(trigger.params.duration > 1){
          str += 's'
        }
        return str;
      } else if (trigger.type == 'recurring'){
        return 'every __ units';
      }
    };
  });
