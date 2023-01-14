const connection = require("./db");

// Path: controllers\order.js


const queryOrder = function (request, response) {
 let orderObject = Object.assign({}, request.query);


 // if all values are empty

 if (Object.values(orderObject).every((value) => value === '')) {
  response.send({
   status: 'empty',
   message: 'Please enter at least one value to query order',
   statusCode: 200
  })
 }
 else if
  (orderObject.transactionid != '') {
  const { orderdate, customerName, billingAddress, transactionid } = orderObject;

  function checkFunctionExist(transactionid) {
   return new Promise((resolve, reject) => {
    let query = `SELECT * FROM payment WHERE transactionid = '${transactionid}'`;

    connection.query(query, (err, result) => {
     if (err) {
      reject(err);
     }
     if (result.length === 0) {
      resolve(false);
     }
     else {
      resolve(true);
     }
    })
   })
  }

  checkFunctionExist(transactionid)
   .then((result) => {
    if (result) {
     let transactionHistory = {};
     let query = `SELECT * FROM payment WHERE transactionid = '${transactionid}'`;
     connection.query(query, (
      err,
      result
     ) => {
      if (err) {
       console.log(err);
      }
      transactionHistory.payment = result;

      // get cart transactionHistory
      let query = `SELECT * FROM cart WHERE transactionid = '${transactionid}'`;
      connection.query(query, (err, result) => {
       if (err) {
        console.log(err);
       }
       transactionHistory.cart = result;

       // get order transactionHistory
       let query = `SELECT * FROM  taxapplied where  transactionid = '${transactionid}'`;
       connection.query(query
        , (err, result) => {
         if (err) {
          console.log(err);
         }
         transactionHistory.taxapplied = result;

         // get order transactionHistory
         let query = `SELECT * FROM  discountapplied where  transactionid = '${transactionid}'`;
         connection.query(query, (err, result) => {
          if (err) {
           console.log(err);
          }
          transactionHistory.discountapplied = result;

          // send response
          response.send({
           status: 'success',
           message: 'Order query successful',
           statusCode: 200,
           transactionHistory: transactionHistory
          })
         })
        })
      })
     }
     )
    } else {
     response.send({
      status: 'error',
      message: 'No order found',
      statusCode: 200
     })
    }
   })
   .catch((err) => {
    console.log(err);
   }
   )
 }
 else if
  (orderObject.transactionid === '' && orderObject.customerName != '') {
  const selector = function () {
   if (orderObject.orderdate !== '') {
    return `SELECT * FROM payment WHERE paymentTo = '${orderObject.customerName}' AND orderdate = '${orderObject.orderdate}'`;
   }
   else {
    return `SELECT * FROM payment WHERE paymentTo = '${orderObject.customerName}'`;
   }
  }

  let query = selector();
  connection.query(query, (err, result) => {
   if (err) {
    console.log(err);
   }
   response.send({
    status: 'incomplete',
    data: result,
   })
  })
 }
 else {
  response.send({
   status: 'error',
   message: 'Please enter a valid value',
   statusCode: 200
  })
 }
}



module.exports = queryOrder;