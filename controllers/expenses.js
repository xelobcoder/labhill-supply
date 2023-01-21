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

 // check if expense date is empty
 if (expenseDate === "") {
  return;
 }

 // check if expense name is empty
 if (expenseName === "" || expenseName === undefined || expenseName === null || expenseName === NaN || expenseAmount === "") {
  res.send({
   status: 'incomplete',
   message: "Expense name and amount cannot be empty",
   statusCode: 400
  })
  return;
 } else {
  // add expense to database
  const query = `INSERT INTO expenses (expenseDate, expenseName, expenseAmount) VALUES ('${expenseDate}', '${expenseName}', '${expenseAmount}')`;
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

module.exports = {
 addExpense,
 getExpenses,
 deleteExpense
};