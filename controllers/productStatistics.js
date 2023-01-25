const connection = require('./db');


const productStatistics = function (request, response) {
 // get the product name and when it was added from the product table
 // get the total number of orders for the product from the order table
 // get the total number sold in weeks, days and months, and year
 //get the stocks where refilled
 //get the total number of stocks refilled

 let stats = {};

 let productid = request.query.productid;

 let ordersTransactionids = [];



 function productFullDetails() {
  let query = `SELECT * FROM product WHERE productid = ${productid}`;
  connection.query(query, function (err, result) {
   if (err) {
    res.send({
     status: 'error',
     message: err.message,
     statusCode: 400
    })
    return;
   }
   if (result && result.length > 0) {
    stats.product = result[0];

    function getOrders() {
     let query = `SELECT * FROM cart WHERE productid = ${productid}`;
     // execute the query
     connection.query(query, function (err, result) {
      if (err) {
       res.send({
        status: 'error',
        message: err.message,
        statusCode: 400
       })
       return;
      }
      if (result && result.length > 0) {
       stats.orders = result;
       stats.orders.forEach(function (order) {
        ordersTransactionids.push(order.transactionid);
       })
       stats.ordersTransactionids = ordersTransactionids;
       stats.totalorders = stats.orders.length;
       stats.quantityordered = stats.orders.reduce((a, b) => a + b.quantity, 0);
       // select all payments where the transactionid is in the ordersTransactionids array
       function getPayments() {
        let query = `SELECT * FROM payment WHERE transactionid IN (${ordersTransactionids})`;
        // execute the query
        connection.query(query, function (err, result) {
         if (err) {
          res.send({
           status: 'error',
           message: err.message,
           statusCode: 400
          })
          return;
         }

         if (result && result.length > 0) {
          stats.payments = result;
          // get total ordered in weeks, days and months, and year
          function sellout() {
           function inWeeks() {
            let query = `SELECT * FROM cart WHERE productid = ${productid} AND WEEKOFYEAR(date) = WEEKOFYEAR(CURRENT_DATE)`;
            // execute the query
            connection.query(query, function (err, result) {
             if (err) {
              return;
             }
             // categorize in days eg sunday, monday, tuesday, wednesday, thursday, friday, saturday
             if (result && result.length > 0) {
              let sunday = result.filter((order) => {
               return new Date(order.date).getDay() === 0;
              })
              let monday = result.filter((order) => {
               return new Date(order.date).getDay() === 1;
              })
              let tuesday = result.filter((order) => {
               return new Date(order.date).getDay() === 2;
              })
              let wednesday = result.filter((order) => {
               return new Date(order.date).getDay() === 3;
              })
              let thursday = result.filter((order) => {
               return new Date(order.date).getDay() === 4;
              })
              let friday = result.filter((order) => {
               return new Date(order.date).getDay() === 5;
              })
              let saturday = result.filter((order) => {
               return new Date(order.date).getDay() === 6;
              })
              stats.weekstats = {
               sunday,
               monday,
               tuesday,
               wednesday,
               thursday,
               friday,
               saturday
              }
              inMonths();
             }
            })
           }

           // in months 
           function inMonths() {
            let query = `SELECT * FROM cart WHERE productid = ${productid} AND MONTH(date) = MONTH(CURRENT_DATE)`;
            // execute the query
            connection.query(query, function (err, result) {
             if (err) {
              return;
             }
             // categotixe into first week, second week, third week, fourth week
             if (result && result.length > 0) {
              let firstweek = result.filter((order) => {
               return new Date(order.date).getDate() <= 7;
              })
              let secondweek = result.filter((order) => {
               return new Date(order.date).getDate() > 7 && new Date(order.date).getDate() <= 14;
              })
              let thirdweek = result.filter((order) => {
               return new Date(order.date).getDate() > 14 && new Date(order.date).getDate() <= 21;
              })
              let fourthweek = result.filter((order) => {
               return new Date(order.date).getDate() > 21;
              })
              stats.monthstats = {
               firstweek,
               secondweek,
               thirdweek,
               fourthweek
              }
              inYear();
             }
            })
           }

           function inYear() {
            let query = `SELECT * FROM cart WHERE productid = ${productid} AND YEAR(date) = YEAR(CURRENT_DATE)`;
            // execute the query
            connection.query(query, function (err, result) {
             if (err) {
              return;
             }
             // categorize into january, february, march, april, may, june, july, august, september, october, november, december
             if (result && result.length > 0) {
              let january = result.filter((order) => {
               return new Date(order.date).getMonth() === 0;
              })
              let february = result.filter((order) => {
               return new Date(order.date).getMonth() === 1;
              })
              let march = result.filter((order) => {
               return new Date(order.date).getMonth() === 2;
              })
              let april = result.filter((order) => {
               return new Date(order.date).getMonth() === 3;
              })
              let may = result.filter((order) => {
               return new Date(order.date).getMonth() === 4;
              })
              let june = result.filter((order) => {
               return new Date(order.date).getMonth() === 5;
              })
              let july = result.filter((order) => {
               return new Date(order.date).getMonth() === 6;
              })
              let august = result.filter((order) => {
               return new Date(order.date).getMonth() === 7;
              })
              let september = result.filter((order) => {
               return new Date(order.date).getMonth() === 8;
              })
              let october = result.filter((order) => {
               return new Date(order.date).getMonth() === 9;
              })
              let november = result.filter((order) => {
               return new Date(order.date).getMonth() === 10;
              })
              let december = result.filter((order) => {
               return new Date(order.date).getMonth() === 11;
              })
              stats.yearstats = {
               january,
               february,
               march,
               april,
               may,
               june,
               july,
               august,
               september,
               october,
               november,
               december
              }
              response.send({
               status: 'success',
               stats
              });
             }
             else {
              response.send({
               status: 'incomplete',
               stats
              });
             }
            })
           }

           inWeeks();
          }
          sellout();
         }
         else {
          response.send({
           status: 'incomplete',
           stats
          });
         }
        })
       }
       getPayments();
      }
      else {
       response.send({
        status: 'incomplete',
        stats
       });
      }
     })
    }
    getOrders();
   }
  })
 }


 productFullDetails();
}


module.exports = {
 productStatistics
}