// add new transaction

const connection = require('./db.js')


function AddTransaction(request, response) {
 const {
  transactionid,
  cart, taxApplied,
  discountApplied,
  discount,
  totalCost
 } = request.body;
 console.log(request.body)
 // check if the cart is not empty

 const cartempty = cart.length === 0 ? true : false;
 if (cartempty) {
  response.send({
   status: 'error',
   message: 'Cart is empty'
  })
 }

 // add new product to the database

 function AddnewtoCart(productname, quantity, total,transactionid,productid) {
  return new Promise((resolve, reject) => {
   const sql = `INSERT INTO cart (productname,quantity,totalcost,transactionid,productid) VALUES (?,?,?,?,?)`;
   connection.query(sql, [productname, quantity, total,transactionid,productid], (err, result) => {
    if (err) {
     reject(err);
    }
    else {
     resolve(result);
    }
   })
  })
 }

 // add new transaction to the database

 function AddnewTransaction(transactionid, taxApplied, discountApplied, discount, totalcost) {
  // create query
  const sql = `INSERT INTO transactions (transactionid,taxApplied, discountApplied, discount, totalcost) VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
   connection.query(sql, [transactionid, `${taxApplied}`, `${discountApplied}`, discount, totalcost], (err, result) => {
    if (err) {
     reject(err);
    }
    else {
     resolve(result);
    }
   })
  })
 }

 if(cart.length> 0) {
  // add new transaction to the database
  AddnewTransaction(transactionid, taxApplied, discountApplied, discount, totalCost)
   .then((result) => {
    // add new product to the database
    // using a while loop to add all products in the cart
    let i = 0;
    while (i < cart.length) {
     AddnewtoCart(cart[i].name, cart[i].quantity, cart[i].total,transactionid,cart[i].productid)
      .then((result) => {
       console.log(result)
      })
      .catch((err) => {
       console.log(err)
      })
     i++;
     if (i === cart.length) {
      response.send({
       status: 'success',
       message: 'Transaction added successfully'
      })
     }
    }
   })
   .catch((err) => {
    console.log(err)
    response.send({
     status: 'error',
     message: 'Error adding transaction'
    })
   })
 }
}




module.exports = AddTransaction;