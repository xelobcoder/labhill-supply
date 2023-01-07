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


function QueryRun(sqlQuery, response) {
  connection.query(sqlQuery,
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
          transactionCountLength,
          imbalance: totalDued - totalPaid
        },
        data: result
      })
    }
  )
}


sales.dailySales = function (request, response) {
  // get current date
  let date = new Date().toISOString().slice(0, 10);
  // create query
  let sql = `SELECT * from payment WHERE date LIKE '${date}%'`;
  // execute query
  QueryRun(sql, response);
}


sales.MonthlySales = function (request, response) {
  let sqlQuery = `SELECT * FROM payment WHERE MONTH(DATE) = MONTH(CURRENT_DATE) AND YEAR(DATE) = YEAR(CURRENT_DATE)`;
  QueryRun(sqlQuery, response);
}

sales.weeklySales = function (request, response) {
  let sqlQuery = `SELECT * FROM payment WHERE WEEK(DATE) = WEEK(CURRENT_DATE) AND YEAR(DATE) = YEAR(CURRENT_DATE)`;
  QueryRun(sqlQuery, response);
}

sales.yearlySales = function (request, response) {
  let sqlQuery = `SELECT * FROM payment WHERE YEAR(DATE) = YEAR(CURRENT_DATE)`;
  QueryRun(sqlQuery, response);
}


sales.weeklyChart = function (request, response) {
  // weekly query
  let sqlQuery = `SELECT * FROM payment WHERE WEEK(DATE) = WEEK(CURRENT_DATE) AND YEAR(DATE) = YEAR(CURRENT_DATE)`;
  connection.query(sqlQuery, function (err, result) {
    if (err) {
      response.send({
        status: "error",
        message: err.message,
        statusCode: 404
      })
    }

    if (result) {
      let category = {
        sunday: [],
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
      };

      result.forEach((item, index) => {
        let date = new Date(item.date).getDay();
        switch (date) {
          case 0:
            category.sunday.push(item);
            break;
          case 1:
            category.monday.push(item);
            break;
          case 2:
            category.tuesday.push(item);
            break;
          case 3:
            category.wednesday.push(item);
            break;
          case 4:
            category.thursday.push(item);
            break;
          case 5:
            category.friday.push(item);
            break;
          case 6:
            category.saturday.push(item);
            break;
          default:
            break;
        }
      });

      // reduce the category data for each day
      function reducerFunction(data = []) {
        if (data.length == 0) {
          return 0;
        }
        else {
          let total = { count: 0, amount: 0 }
          for (let i = 0; i < data.length; i++) {
            total.count += 1;
            total.amount += data[i].amountpaid;
          }
          return total;
        }
      }

      let dataset = {};

      dataset.sunday = reducerFunction(category.sunday);
      dataset.monday = reducerFunction(category.monday);
      dataset.tuesday = reducerFunction(category.tuesday);
      dataset.wednesday = reducerFunction(category.wednesday);
      dataset.thursday = reducerFunction(category.thursday);
      dataset.friday = reducerFunction(category.friday);
      dataset.saturday = reducerFunction(category.saturday);

      response.send({
        status: "success",
        message: "weekly sales",
        statusCode: 200,
        data: dataset,
        labels: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
      })
    }
  })
}



module.exports = sales;