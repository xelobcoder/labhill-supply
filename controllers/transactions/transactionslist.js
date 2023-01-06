const connection = require('../db');

const transactions = {};

transactions.prototype.getAllTransactions = function (request, response) {
 // get all transactions
 let sql = `select * from transaction orderby id asc limit 100`;
 // connection to db
 connection.query(sql, (err, response) => {
  if (err) { throw err; }
  response.send({
   status: '200',
   statusMessage: 'success',
   result
  })
 })
}