
//BUDGET CONTROLLER MODULE
var budgetController = (function() {

    var Expense  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };//function constructors are always capital

    var Income  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
      allItems:{
        exp: [],
        inc: []
      },
      totals: {
        exp: 0,
        inc: 0
      }
    };

    return {
        addItem: function(type, des, val) {
          var newItem, ID;

          //ID is a unique number to assign to each expense or income array
          //ID should equal last ID + 1
          //Create new ID
          if(data.allItems[type].length > 0) {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
          } else {
            ID = 0;
          }

          //Create new item based on 'inc' or 'exp' type
            if(type === 'exp'){
              newItem = new Expense(ID, des, val);
            } else if (type === 'inc'){
              newItem = new Income(ID, des, val);
            }

            //add to data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        testing: function() {
          console.log(data);
        }
    };

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
        type: document.querySelector(DOMstrings.inputType).value,// will be either 'inc' income or 'exp' expense
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
    var input, newItem;
    // 1. get the field input data
    input = UICtrl.getInput();
    // console.log(input); to test that the input is showing up.

    // 2. add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

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
