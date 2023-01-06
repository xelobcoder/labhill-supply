const connection = require("./db");

const addStock = function (request, response) {
 // get all transactions 
 let sql = `select * from product`;
 connection.query(sql, function (err, result) {
  if (err) {
   response.send(
    {
     statusCode: 500,
     status: 'error',
     message: err.message
    }
   )
  }
  response.send({
   statusCode: 200,
   status: 'success',
   result
  })
 })
}



const updateStock = function (request, response) {
 // add to stock table 
 // update qunatity in product table
 let {productname,productid,instock,addedqty,totalqty} = request.body;
 let sql = `insert into stocks (productname,productid,qtyadded) values (?, ?, ?)`;
 connection.query(sql, [productname,productid,addedqty], function (err, result) {
  if (err) {
   response.send(
    {
     statusCode: 500,
     status: 'error',
     message: err.message
    }
   )
  }
  // update product table 
  let sql = `update product set quantity = ? where productid = ?`;
  connection.query (sql, [totalqty,productid], function (err, result) {
   if (err) {
    response.send(
     {
      statusCode: 500,
      status: 'error',
      message: err.message
     }
    )
   }
   response.send({
    statusCode: 200,
    status: 'success',
    result
   })
  })
 });
}



module.exports = { addStock, updateStock }