const connection = require('./db');

// create a Tax Class

class Tax {
 constructor(request,response) {
  this.request = request;
  this.response = response;
 }

 getAllTax() {
  let sql = 'SELECT * FROM tax';
  connection
   .query(sql,(err,result) => {
    if(err) throw err;
    this.response.json(result);
   })
 }

 getSingleTax(id) {
  let sql = 'SELECT * FROM tax WHERE id = ?';
  connection
   .query(sql,[this.request.params.id],(err,result) => {
    if(err) throw err;
    this.response.json(result);
   })
 }

 addTax() {
  const {name,rate} = this.request.body;
  let sql = 'INSERT INTO tax SET ?';
  connection
   .query(sql,[name,rate],(err,result) => {
    if(err) throw err;
    this.response.json(result);
   })

  }

  deleteTax(id) {
   let sql = 'DELETE FROM tax WHERE id = ?';
   connection
    .query(sql,[this.request.params.id],(err,result) => {
     if(err) throw err;
     this.response.json(result);
    })
  }

  updateTax(id) {
   const {name,rate} = this.request.body;
   let sql = 'UPDATE tax SET ? WHERE id = ?';
   connection
    .query(sql,[name,rate,id],(err,result) => {
     if(err) throw err;
     this.response.json(result);
    })
  }
}



module.exports = Tax;