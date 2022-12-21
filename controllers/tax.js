const { json } = require('express');
const connection = require('./db');

// create a Tax Class

class Tax {
 constructor(request, response) {
  this.request = request;
  this.response = response;
 }

 getAllTax() {
  let sql = 'SELECT * FROM tax';
  connection
   .query(sql, (err, result) => {
    if (err) throw err;
    this.response.json(result);
   })
 }

 updateTaxAppliedStatus(status, taxid) {
  let sql = `UPDATE tax SET taxapplied = '${status}' WHERE taxid = ${taxid}`;
  connection.query(sql, (err, result) => {
   if (err) throw err;
   this.response.json({
    message: 'Tax applied status updated',
    result,
    status: 'success'
   });
  })
 }

 getSingleTax(id) {
  let sql = 'SELECT * FROM tax WHERE id = ?';
  connection
   .query(sql, [this.request.params.id], (err, result) => {
    if (err) throw err;
    this.response.json(result);
   })
 }

 taxToApply() {
  let response = this.response;
  // select with taxapllied being TRUE
  let sql = `SELECT * FROM tax WHERE taxapplied = 'TRUE'`;
  connection.query(sql, function (err, result) {
   if (err) { throw err };
   response.send(result)
  })
 }
 addTax() {
  let response = this.response;
  const { name, rate } = this.request.body;

  if (rate > 100) {
   return response.send({
    message: 'Tax rate cannot be more than 100%',
    status: 'error'
   })
  }

  if (name && rate) {
   // check if the tax already exist
   let sql = 'SELECT * FROM tax WHERE taxname = ?';
   connection.query(sql, [name], function (err, results) {
    if (err) throw err;
    if (results.length > 0) {
     response.send({
      message: 'Tax already exist',
      status: 'error'
     });
    } else {
     let sql = `INSERT INTO tax (taxname,taxrate) VALUES (?,?)`;
     connection
      .query(sql, [name, rate], (err, result) => {
       if (err) throw err;
       response.send({
        message: 'Tax added successfully',
        status: 'success'
       })
      })
    }
   })

  }
 }

 deleteTax(id) {
  let response = this.response;
  let sql = 'DELETE FROM tax WHERE taxid = ?';
  connection
   .query(sql, [id], (err, result) => {
    if (err) throw err;
    if (result) {
     connection.query('SELECT * FROM tax', function (err, result) {
      if (err) { throw err };
      response.send({
       message: 'Tax deleted successfully',
       status: 'success',
       result
      })
     })
    }
   })
 }

 updateTax(id) {
  const { name, rate } = this.request.body;
  let sql = 'UPDATE tax SET ? WHERE id = ?';
  connection
   .query(sql, [name, rate, id], (err, result) => {
    if (err) throw err;
    this.response.json(result);
   })
 }
}



module.exports = Tax;