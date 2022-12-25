const connection = require('./db.js');

const renderCart = function (request, response, next) {
 // get all product name
 function getAllProducts(data) {
  let productnames = data.map((item) => {
   return item.productname;
  })
  return productnames;
 }
 // create an single transaction object 
 let information = {};
 // get the transaction id from query
 const transactionid = request.query.transactionid;
 // get the cart from the database
 const sql = `SELECT * FROM cart where transactionid = ?`;

 if (transactionid) {
  // get the connection 
  connection.query(sql, [transactionid], (err, result) => {
   if (err) {
    throw err;
   }
   else {
    // get the cart from the database
    information.cart = result;
    // get the transaction from the database
    const sql = `SELECT * FROM transactions where transactionid = ?`;
    connection.query(sql, [transactionid], (err, result) => {
     if (err) {
      throw err;
     }
     else {
      information.transaction = result;
      // get the product from the database
      const sql = `SELECT * FROM product where name IN (?)`;
      connection.query(sql, [getAllProducts(information.cart)], (err, result) => {
       if (err) {
        throw err;
       }
       information.product = result;
       // get tax applied to that pacticular transaction
       let mysql = `SELECT * FROM taxapplied where transactionid =(?)`;
       connection.query(mysql,[transactionid],(err,result) => {
        if(err) {throw err}
        information.taxesApplied = result;
        response.send(information);
       })
      })
     }
    });
   }
  })
 }
 else {
  response.send({
   status: 'error',
   message: 'transaction id is required'
  })
 }
}



module.exports = renderCart;