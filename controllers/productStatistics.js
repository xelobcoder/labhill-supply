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

              console.log(sunday, monday, tuesday, wednesday, thursday, friday, saturday);
              stats.weekstats = {
               sunday: {
                count: sunday.length,
                quantity: sunday.reduce((a, b) => a + b.quantity, 0),
                total: sunday.reduce((a, b) => a + b.totalcost, 0)
               },
               monday: {
                count: monday.length,
                quantity: monday.reduce((a, b) => a + b.quantity, 0),
                total: monday.reduce((a, b) => a + b.totalcost, 0)
               },
               tuesday: {
                count: tuesday.length,
                quantity: tuesday.reduce((a, b) => a + b.quantity, 0),
                total: tuesday.reduce((a, b) => a + b.totalcost, 0)
               },
               wednesday: {
                count: wednesday.length,
                quantity: wednesday.reduce((a, b) => a + b.quantity, 0),
                total: wednesday.reduce((a, b) => a + b.totalcost, 0)
               },
               thursday: {
                count: thursday.length,
                quantity: thursday.reduce((a, b) => a + b.quantity, 0),
                total: thursday.reduce((a, b) => a + b.totalcost, 0)
               },
               friday: {
                count: friday.length,
                quantity: friday.reduce((a, b) => a + b.quantity, 0),
                total: friday.reduce((a, b) => a + b.totalcost, 0)
               },
               saturday: {
                count: saturday.length,
                quantity: saturday.reduce((a, b) => a + b.quantity, 0),
                total: saturday.reduce((a, b) => a + b.totalcost, 0)
               }
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
               firstweek: {
                count: firstweek.length,
                quantity: firstweek.reduce((a, b) => a + b.quantity, 0),
                total: firstweek.reduce((a, b) => a + b.totalcost, 0)
               },
               secondweek: {
                count: secondweek.length,
                quantity: secondweek.reduce((a, b) => a + b.quantity, 0),
                total: secondweek.reduce((a, b) => a + b.totalcost, 0)
               },
               thirdweek: {
                count: thirdweek.length,
                quantity: thirdweek.reduce((a, b) => a + b.quantity, 0),
                total: thirdweek.reduce((a, b) => a + b.totalcost, 0)

               },
               fourthweek: {
                count: fourthweek.length,
                quantity: fourthweek.reduce((a, b) => a + b.quantity, 0),
                total: fourthweek.reduce((a, b) => a + b.totalcost, 0)
               }
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
               january: {
                count: january.length,
                quantity: january.reduce((a, b) => a + b.quantity, 0),
                total: january.reduce((a, b) => a + b.totalcost, 0)
               },
               february: {
                count: february.length,
                quantity: february.reduce((a, b) => a + b.quantity, 0),
                total: february.reduce((a, b) => a + b.totalcost, 0)
               },
               march: {
                count: march.length,
                quantity: march.reduce((a, b) => a + b.quantity, 0),
                total: march.reduce((a, b) => a + b.totalcost, 0)
               },
               april: {
                count: april.length,
                quantity: april.reduce((a, b) => a + b.quantity, 0),
                total: april.reduce((a, b) => a + b.totalcost, 0)
               },
               may: {
                count: may.length,
                quantity: may.reduce((a, b) => a + b.quantity, 0),
                total: may.reduce((a, b) => a + b.totalcost, 0)
               },
               june: {
                count: june.length,
                quantity: june.reduce((a, b) => a + b.quantity, 0),
                total: june.reduce((a, b) => a + b.totalcost, 0)
               },
               july: {
                count: july.length,
                quantity: july.reduce((a, b) => a + b.quantity, 0),
                total: july.reduce((a, b) => a + b.totalcost, 0)
               },
               august: {
                count: august.length,
                quantity: august.reduce((a, b) => a + b.quantity, 0),
                total: august.reduce((a, b) => a + b.totalcost, 0)
               },
               september: {
                count: september.length,
                quantity: september.reduce((a, b) => a + b.quantity, 0),
                total: september.reduce((a, b) => a + b.totalcost, 0)
               },
               october: {
                count: october.length,
                quantity: october.reduce((a, b) => a + b.quantity, 0),
                total: october.reduce((a, b) => a + b.totalcost, 0)
               },
               november: {
                count: november.length,
                quantity: november.reduce((a, b) => a + b.quantity, 0),
                total: november.reduce((a, b) => a + b.totalcost, 0)
               },
               december: {
                count: december.length,
                quantity: december.reduce((a, b) => a + b.quantity, 0),
                total: december.reduce((a, b) => a + b.totalcost, 0)
               }
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