class EditBlockController {
  constructor() {
    console.log('ChoiceRow init')
    this.editing = false;
  }
  editToggle(toggle){
    console.log('Toggling editing...')
    if(typeof toggle == 'undefined'){
      this.editing == !this.editing;
    } else {
      this.editing = toggle;
    }
  }
}


angular.module('riverApp')
  .controller('EditBlockController', EditBlockController);
