const connection = require('./db');
const addExpense = async (req, res) => {
 // get query object
 const expenseObject = req.query;
 // get expense date
 const expenseDate = expenseObject.expenseDate;
 // get expense name
 const expenseName = expenseObject.expenseName;
 // get expense amount
 const expenseAmount = parseInt(expenseObject.expenseAmount);
 // get expenseCategory
 const expenseCategory = expenseObject.expenseCategory;

 // check if expense name is empty
 if (expenseName === "" || expenseDate == '' || expenseName === undefined || expenseName === null || expenseName === NaN || expenseAmount === "" ||expenseAmount === 0) {
  res.send({
   status: 'incomplete',
   message: "Expense name ,date and amount cannot be empty",
   statusCode: 400
  })
  return;
 } else {
  // add expense to database
  const query = `INSERT INTO expenses (expenseName, expenseDate, expenseAmount, category) VALUES ('${expenseName}', '${expenseDate}', '${expenseAmount}', '${expenseCategory}')`;
  connection
   .query(query, function (err, result) {
    if (err) {
     res.send({
      status: 'error',
      message: err.message,
      statusCode: 400
     })
     return;
    }
    res.send({
     status: 'success',
     message: 'Expense added successfully',
     statusCode: 200
    })
   })
 }
};



const getExpenses = async (req, res) => {
 // querry
 const query = `SELECT * FROM expenses`;
 connection

  .query
  (query, function (err, result) {
   if (err) {
    res.send({
     status: 'error',
     message: err.message,
     statusCode: 400
    })
    return;
   }
   res.send({
    status: 'success',
    message: 'Expense query successful',
    statusCode: 200,
    expenses: result
   })
  })
}

const deleteExpense = async (req, res) => {
 const expenseid = req.body.expenseId;
 console.log(expenseid);
 const query = `DELETE FROM expenses WHERE expenseid = '${expenseid}'`;
 connection
  .query
  (query,
   function (err, result) {
    if (err) {
     res.send({
      status: 'error',
      message: err.message,
      statusCode: 400
     })
     return;
    }
    res.send({
     status: 'success',
     message: 'Expense deleted successfully',
     statusCode: 200
    })
   })

}


const getWeeklyExpenseChart = async (req, res) => {
 // get date object
 const date = new Date().toISOString().slice(0, 10);
 // get weekly expenses
 const query = `SELECT * FROM expenses WHERE WEEK(expenseDate) = WEEK(CURRENT_DATE) AND YEAR(expenseDate) = YEAR(CURRENT_DATE)`;
 connection.query(query, function (err, result) {
  if (err) {
   res.send({
    status: 'error',
    message: err.message,
    statusCode: 400
   })
   return;
  }

  // get weekly expenses
  let weeklyChart = {};

  // get total expenses
  weeklyChart.count = result.length;


  // get total expenses

  weeklyChart.total = result.reduce((total, expense) => {
   return total + expense.expenseAmount;
  }, 0);


  let sunday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 0;
  });

  let monday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 1;
  });

  let tuesday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 2;
  }
  );

  let wednesday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 3;
  });

  let thursday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 4;
  });

  let friday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 5;
  }
  );

  let saturday = result.filter((expense) => {
   return new Date(expense.expenseDate).getDay() === 6;
  }
  );

  weeklyChart.days = {
   sunday: sunday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }, 0),
   monday: monday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }, 0),
   tuesday: tuesday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }, 0),
   wednesday: wednesday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }, 0),
   thursday: thursday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }
    , 0),
   friday: friday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }
    , 0),
   saturday: saturday.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }
    , 0)

  }

  weeklyChart.label = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  res.send({
   status: 'success',
   message: 'Expense query successful',
   statusCode: 200,
   expenses: weeklyChart
  })
 })
}


function getMonthlyExpenseChart(req, res) {
 // get date object
 const date = new Date().toISOString().slice(0, 10);
 // get weekly expenses
 const query = `SELECT * FROM expenses WHERE MONTH(expenseDate) = MONTH(CURRENT_DATE) AND YEAR(expenseDate) = YEAR(CURRENT_DATE)`;
 connection
  .query
  (query, function (err, result) {
   if (err) {
    res.send({
     status: 'error',
     message: err.message,
     statusCode: 400
    })
    return;
   }

   // get weekly expenses
   let monthlyChart = {};

   // get total expenses
   monthlyChart.count = result.length;

   // reduce total expenses to first week, second week, third week and fourth week
   monthlyChart.total = result.reduce((total, expense) => {
    return total + expense.expenseAmount;
   }, 0);

   let firstWeek = result.filter((expense) => {
    return new Date(expense.expenseDate).getDate() <= 7;
   });

   let secondWeek = result.filter((expense) => {
    return new Date(expense.expenseDate).getDate() > 7 && new Date(expense.expenseDate).getDate() <= 14;
   });

   let thirdWeek = result.filter((expense) => {
    return new Date(expense.expenseDate).getDate() > 14 && new Date(expense.expenseDate).getDate() <= 21;
   }
   );

   let fourthWeek = result.filter((expense) => {
    return new Date(expense.expenseDate).getDate() > 21;
   });

   monthlyChart.weeks = {
    firstWeek: firstWeek.reduce((total, expense) => {
     return total + expense.expenseAmount;
    }
     , 0),
    secondWeek: secondWeek.reduce((total, expense) => {
     return total + expense.expenseAmount;
    }
     , 0),
    thirdWeek: thirdWeek.reduce((total, expense) => {
     return total + expense.expenseAmount;
    }
     , 0),
    fourthWeek: fourthWeek.reduce((total, expense) => {
     return total + expense.expenseAmount;
    }
     , 0)
   }

   monthlyChart.label = ['First Week', 'Second Week', 'Third Week', 'Fourth Week']

   res.send({
    status: 'success',
    message: 'Expense query successful',
    statusCode: 200,
    expenses: monthlyChart
   })
  })
}

module.exports = {
 addExpense,
 getExpenses,
 deleteExpense,
 getWeeklyExpenseChart,
 getMonthlyExpenseChart
};