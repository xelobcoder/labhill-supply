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
            console.log(item);
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
            total.amount += data[i].amountdue;
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



sales.monthlyChart = function (request, response) {
  // weekly query
  let sqlQuery = `SELECT * FROM payment WHERE MONTH(DATE) = MONTH(CURRENT_DATE) AND YEAR(DATE) = YEAR(CURRENT_DATE)`;
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
        firstWeek: [],
        secondWeek: [],
        thirdWeek: [],
        fourthWeek: [],
      };

      result.forEach((item, index) => {
        let date = new Date(item.date).getDate();
        if (date <= 7) {
          category.firstWeek.push(item);
        }
        else if (date > 7 && date <= 14) {
          category.secondWeek.push(item);
        }
        else if (date > 14 && date <= 21) {
          category.thirdWeek.push(item);
        }
        else if (date > 21) {
          category.fourthWeek.push(item);
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
            total.amount += data[i].amountdue;
          }
          return total;
        }
      }

      let dataset = {};

      dataset.firstWeek = reducerFunction(category.firstWeek);
      dataset.secondWeek = reducerFunction(category.secondWeek);
      dataset.thirdWeek = reducerFunction(category.thirdWeek);
      dataset.fourthWeek = reducerFunction(category.fourthWeek);

      response.send({
        status: "success",
        message: "monthly sales",
        statusCode: 200,
        data: dataset,
        labels: ["first week", "second week", "third week", "fourth week"]
      })
    }
  })
}



sales.yearlyChart = function (request, response) {
  // yearly chart 
  let sqlQuery = `SELECT * FROM payment WHERE YEAR(DATE) = YEAR(CURRENT_DATE)`;
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
        january: [],
        february: [],
        march: [],
        april: [],
        may: [],
        june: [],
        july: [],
        august: [],
        september: [],
        october: [],
        november: [],
        december: []
      };

      result.forEach((item, index) => {
        let date = new Date(item.date).getMonth();
        switch (date) {
          case 0:
            category.january.push(item);
            break;
          case 1:
            category.february.push(item);
            break;
          case 2:
            category.march.push(item);
            break;
          case 3:
            category.april.push(item);
            break;
          case 4:
            category.may.push(item);
            break;
          case 5:
            category.june.push(item);
            break;
          case 6:
            category.july.push(item);
            break;
          case 7:
            category.august.push(item);
            break;
          case 8:
            category.september.push(item);
            break;
          case 9:
            category.october.push(item);
            break;
          case 10:
            category.november.push(item);
            break;
          case 11:
            category.december.push(item);
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
            total.amount += data[i].amountdue;
          }
          return total;
        }
      }

      let dataset = {};

      dataset.january = reducerFunction(category.january);
      dataset.february = reducerFunction(category.february);
      dataset.march = reducerFunction(category.march);
      dataset.april = reducerFunction(category.april);
      dataset.may = reducerFunction(category.may);
      dataset.june = reducerFunction(category.june);
      dataset.july = reducerFunction(category.july);
      dataset.august = reducerFunction(category.august);
      dataset.september = reducerFunction(category.september);
      dataset.october = reducerFunction(category);

      dataset.november = reducerFunction(category.november);
      dataset.december = reducerFunction(category.december);

      response.send({
        status: "success",
        message: "yearly sales",
        statusCode: 200,
        data: dataset,
        labels: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
      })
      
    }
  })
}



module.exports = sales;