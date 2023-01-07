const connection = require("../controllers/db.js");
const sales = {};

// daily  sales


// function for calculating total amount of sales
function calulateTotal(result, parameter) {
  let total = 0;
  for (let i = 0; i < result.length; i++) {
    total += parseInt(result[i][parameter]);
  }
  return total;
}

// get the transaction count 
function transactionCount(result) {
  return result.length;
}




sales.dailySales = function (request, response) {
  // get current date
  let date = new Date().toISOString().slice(0, 10);
  console.log(date);
  // create query
  let sql = `SELECT * from payment WHERE date LIKE '${date}%'`;
  // execute query
  connection.query(sql,
    function (err, result) {
      if (err) {
        console.log(err);
        response.status(500).send({
          status: "error",
          message: err.message
        });
      }

      let totalDued = calulateTotal(result, 'amountdue');
      let totalPaid = calulateTotal(result, 'amountpaid');
      let totalDisount = calulateTotal(result, 'discount');
      let totalTax = calulateTotal(result, 'totalTax');
      let transactionCountLength = transactionCount(result);

      response.send({
        status: "success",
        message: "daily sales",
        statusCode: 200,
        summary: {
          totalDued,
          totalPaid,
          totalTax,
          totalDisount,
          transactionCountLength
        },
        data: result
      })
    }
  )
}



module.exports = sales;