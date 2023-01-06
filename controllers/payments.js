const connection = require('./db');


// Update the payment Records 
function UpdatePayment(request, response) {
 let sql = `UPDATE payment SET paymentmode = ?,deliveryaddress = ?,amountdue = ?,paymentTo = ?,amountpaid = ?,totalTax = ?,discount = ? where transactionid = ?`;
 connection.query(sql, [paymentmode, deliveryaddress, totalcost, paymentTo, paidAmount, tax, discount, transactionid], (err, result) => {
  if (err) { throw err }
  response.send({
   status: 'success',
   message: 'payment updated'
  })
 })
}



function CheckPayment(transactionid) {
 // using a promise to check if payment is already made
 return new Promise((resolve, reject) => {
  // check if transaction id exist in table payment
  const sql = `SELECT * FROM payment where transactionid = ?`;
  connection.query(sql, [transactionid], (err, result) => {
   if (err) {
    reject(err);
   }
   else {
    if (result.length > 0) {
     resolve(true);
    }
    else {
     resolve(false);
    }
   }
  })
 })
}

const NewPayment = function (request, response) {
 let payment = request.body;
 const { paymentmode, deliveryaddress, totalcost, paymentTo, paidAmount, subtotal, tax, total, discount, transactionid } = payment;
 // check if payment is already made

 function SavePayments() {
  // check if payment is already made
  CheckPayment(transactionid).then((result) => {
   // if payment is not made
   console.log(result);
   if (!result) {
    // save payment
    const sql = `INSERT INTO payment (paymentmode,deliveryaddress,amountdue,paymentTo,amountpaid,totalTax,discount,transactionid) VALUES (?,?,?,?,?,?,?,?)`;
    connection.query(sql, [paymentmode, deliveryaddress, totalcost, paymentTo, paidAmount, tax, discount, transactionid], (err, result) => {
     if (err) {
      response.send({
       status: 'error',
       message: 'An error occured while adding payment'
      });
      throw new Error(err);
     }

     if (result) {
      response.send({
       status: 'success',
       message: 'Payment added successfully'
      });
     }
    })
   }

   if (result) {
    response.send({
     status: 'info',
     message: 'Payment already made'
    })
   }
  }).catch((err) => { console.log(err) })
 }

 let KEYS = Object.keys(request.body);
 //  check if all keys have values

 let target = 0;

 for (let i = 0; i < KEYS.length; i++) {
  let value = request.body[KEYS[i]];
  if (value === '') {
   return false;
  }
  else {
   target++;
  }
 }


 if (target === KEYS.length) {
  SavePayments();
 
 }
 else {
  response.send({
   status: 'error',
   message: 'fill all fields'
  })
 }
}



module.exports = { NewPayment, UpdatePayment }