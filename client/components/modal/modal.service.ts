'use strict';

angular.module('florenceApp')
  .factory('Modal', function($rootScope, $uibModal) {
    /**
     * Opens a modal
     * @param  {Object} scope      - an object to be merged with modal's scope
     * @param  {String} modalClass - (optional) class(es) to be applied to the modal
     * @return {Object}            - the instance $uibModal.open() returns
     */
    function openModal(scope = {}, modalClass = 'modal-default') {
      var modalScope = $rootScope.$new();

      angular.extend(modalScope, scope);

      return $uibModal.open({
        templateUrl: 'components/modal/modal.html',
        windowClass: modalClass,
        scope: modalScope
      });
    }

    // Public API here
    return {

      /* Confirmation modals */
      confirm: {

        /**
         * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
         * @param  {Function} del - callback, ran when delete is confirmed
         * @return {Function}     - the function to open the modal (ex. myModalFn)
         */
        delete(del = angular.noop) {
          /**
           * Open a delete confirmation modal
           * @param  {String} name   - name or info to show on modal
           * @param  {All}           - any additional args are passed straight to del callback
           */
          return function() {
            var args = Array.prototype.slice.call(arguments),
              name = args.shift(),
              deleteModal;

            deleteModal = openModal({
              modal: {
                dismissable: true,
                title: 'Confirm Delete',
                html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
                buttons: [{
                  classes: 'btn-danger',
                  text: 'Delete',
                  click: function(e) {
                    deleteModal.close(e);
                  }
                }, {
                    classes: 'btn-default',
                    text: 'Cancel',
                    click: function(e) {
                      deleteModal.dismiss(e);
                    }
                  }]
              }
            }, 'modal-danger');

            deleteModal.result.then(function(event) {
              del.apply(event, args);
            });
          };
        }
      },
      open: function(options, modalClass, end = angular.noop) {

        return function() {
          var args = Array.prototype.slice.call(arguments),
            name = args.shift(),
            newModal;

            setupButtonRoles();

            newModal = openModal(options, modalClass);

            newModal.result.then(function(event) {
              end.apply(event, args);
            });



          function setupButtonRoles(){
            options.modal = options.modal || {};
            options.modal.buttons = options.modal.buttons || [];

            if (options.modal.buttons.length > 1) {
              options.modal.buttons[0].click = function(e) {
                newModal.dismiss(e);
              }
              options.modal.buttons[1].click = function(e) {
                newModal.close(e);
              }
            } else if (options.modal.buttons.length == 1) {
              options.modal.buttons[0].click = function(e) {
                newModal.close(e);
              }
            }
          }
        }
      }
    };
  });
