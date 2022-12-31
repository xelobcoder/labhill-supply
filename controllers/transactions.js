// add new transaction
const connection = require('./db.js')
function AddTransaction(request, response, next) {
 const {
  transactionid,
  cart, taxApplied,
  discountApplied,
  discount,
  totalCost
 } = request.body;
 // check if the cart is not empty

 const cartempty = cart.length === 0 ? true : false;
 if (cartempty) {
  response.send({
   status: 'error',
   message: 'Cart is empty'
  })
 }

 function getTaxData() {
  if (taxApplied == false) {
   return null;
  }
  else {
   // get all tax data whrer tax is applied = TRUE
   const sql = `SELECT * FROM tax WHERE taxapplied = 'TRUE'`;
   connection
    .query(sql, (err, result) => {
     if (err) {
      throw err;
     }
     // if result is not empty, add to tax applied data for that transaction
     if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
       const sql = `INSERT INTO taxapplied (transactionid, taxname, rate) VALUES (?,?,?)`;
       connection.query(sql, [transactionid, result[i].taxname, result[i].taxrate], (err, result) => {
        if (err) {
         throw err;
        }
       })
      }
     }
    })
  }
 }

 // add new product to the database

 function AddnewtoCart(productname, quantity, total, transactionid, productid) {
  return new Promise((resolve, reject) => {
   const sql = `INSERT INTO cart (productname,quantity,totalcost,transactionid,productid) VALUES (?,?,?,?,?)`;
   connection.query(sql, [productname, quantity, total, transactionid, productid], (err, result) => {
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


 function AddnewtoDiscount(discount, transactionid) {
  return new Promise((resolve, reject) => {
   const sql = `INSERT INTO discountapplied (discount, transactionid) VALUES (?,?)`;
   connection.query(sql, [discount, transactionid], (err, result) => {
    if (err) {
     reject(err);
    }
    else {
     resolve(result);
    }
   })
  })
 }

 if (cart.length > 0) {
  // add new transaction to the database
  AddnewTransaction(transactionid, taxApplied, discountApplied, discount, totalCost)
   .then((result) => {
    // add new product to the database
    // using a while loop to add all products in the cart
    let i = 0;
    while (i < cart.length) {
     AddnewtoCart(cart[i].name, cart[i].quantity, cart[i].total, transactionid, cart[i].productid)
      .then((result) => {
      })
      .catch((err) => {
       console.log(err)
      })
     i++;
     if (i === cart.length) {
      // add discount to the database
      if (discountApplied == true) {
       AddnewtoDiscount(discount, transactionid)
        .then((result) => {
         if (result) {
          // get tax data
          getTaxData();
          response.send({
           status: 'success',
           message: 'Transaction added successfully',
           transactionid
          })
         }
        })
        .catch((err) => {
         console.log(err)
        })
      }
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