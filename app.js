
//BUDGET CONTROLLER MODULE
var budgetController = (function() {

    var Expense  = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };//function constructors are always capital

    var calculateTotal = function(type){
      var sum = 0;
      data.allItems[type].forEach(function(cur){
        sum += cur.value;
      });
      data.totals[type] = sum;
    };

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
      },
      budget: 0,
      percentage: -1//a value we use to say that something is non-existent.

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

        calculateBudget: function(){
          //calculate sum of all incomes and expenses
          calculateTotal('exp');//function from line 11
          calculateTotal('inc');//function from line 11

          //calculate the budget: income - expenses
          //first create a budget property on line 34 as a prop of the data object
          data.budget = data.totals.inc - data.totals.exp;

          //calculate the percentage of income that we spent
          //first create a percentage property on line 35 as a prop of the data object
          if (data.totals.inc > 0){//this protects us if there is no income but there are expenses
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);//math.round()allows us to round it to the closest integer
            //so if your expense was 150 and your income was 300 you spent half your income. 150/300 =0.5 * 100 = 50%
          } else {
            data.percentage = -1;
          }

        },

        getBudget: function(){
          return {
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage
          };
        },

        testing: function() {
          console.log(data);
        }
    };

})();


//MODULE FOR UI CONTROLLER
var UIController = (function() {
  //instead of using 'document.querySelector etc we can store it in a private variable so if we change something in the UI we don't have to go and do each one manually in the javascript
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expense__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container'
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,// will be either 'inc' income or 'exp' expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)//parseFloat converts a string to a floating number - or a number with decimals.
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      //create an HTML string with placeholder text-align
      if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc+%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp+%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

      //replace the placeholder text with data by creating a new method
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);


      //insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function(){
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      //querySelectorAll returns a list so we must convert the list to an array.  We must use slice, which returns a copy of the array it is called on

      fieldsArr = Array.prototype.slice.call(fields);//this tricks the slice method into thinking we're giving it an array, so we'll get an array in return

      fieldsArr.forEach(function(current, index, array){
        current.value = "";
      });

      fieldsArr[0].focus();//returns focus or the mouse pointer to a specific input field.  Index position zero is 'Add description' in this case so after the fields are cleared the mouse returns to that field.
    },

    displayBudget: function(obj){
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

      if (obj.percentage > 0){
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }

    },

    getDOMstrings: function() {
      return
        DOMstrings;
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

      //add event handler for delete button
      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  var updateBudget = function(){

    // 1. calculate the budget
    budgetCtrl.calculateBudget();
    // 2. a method that returns the budget
    //created an object to hold all the budget properties on line 83-88
    var budget = budgetCtrl.getBudget();

    // 3. display the budget on the UI
    // console.log(budget); ->to check the budget object is showing up
    UICtrl.displayBudget(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;
    // 1. get the field input data

    input = UICtrl.getInput();
    // console.log(input); to test that the input is showing up.


    //all of the below can only happen if there is data present in the input fields.
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){//the input description should not be empty and the value should not be NaN

      // 2. add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. add the new item to the UI
      UICtrl.addListItem(newItem, input.type);

      //3.5 clear the fields
      UICtrl.clearFields();

      //4. calculate and update budget
      updateBudget();
    }

  };
  var ctrlDeleteItem = function(event){
      var itemID, splitID type, ID;

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if(itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = splitID[1];

        // delete item from data structure

        //delete the item from UI

        //update and show new budget
      }

  };

  return {
    init: function() {
      console.log('app started');
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };


})(budgetController, UIController);

controller.init();//without this line of code nothing happens because it has all event listeners
