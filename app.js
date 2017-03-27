
//module for budget controller
var budgetController = (function() {



})();


//UI module for user interface controller
var UIController = (function() {
  //instead of using 'document.querySelector etc we can store it in a private variable so if we change something in the UI we don't have to go and do each one manually in the javascript
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'
  }

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,// will be either income or expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };

})();


//we need a way to read data from the UI and add it as a budget controller
//what we have here is a separation of concerns to give us agility but the modules still need to talk to each other

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl) {

  //let's create a function to setup/hold all event listeners
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    //set up event listener by selecting an element and then attaching an event
      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      //in order to allow people to use the 'return' button you need a keypress event
      document.addEventListener('keypress', function(event){
        // console.log(event); //to see what happens when we 'keypress' any key. keycode for return button is '13'
        if (event.keyCode === 13 || event.which === 13) {
          // console.log('ENTER was pressed.')
          ctrlAddItem();
        }

      });

  };

  var ctrlAddItem = function() {
    // 1. get the field input data
    var input = UICtrl.getInput();
    // console.log(input); to test that the input is showing up.
    // 2. add the item to the budget controller

    // 3. add the new item to the UI

    // 4. calculate the budget

    // 5. display the budget

  };

  return {
    init: function() {
      console.log('app started');
      setupEventListeners();
    }
  };


})(budgetController, UIController);

controller.init();//without this line of code nothing happens because it has all event listeners
