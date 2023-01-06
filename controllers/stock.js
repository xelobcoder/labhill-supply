const connection = require("./db");

const addStock = function (request, response) {
 // get all transactions 
 let sql = `select * from stocks`;
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

}



module.exports = { addStock, updateStock }