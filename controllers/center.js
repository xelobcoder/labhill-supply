const connection = require('./db');

const uploadCenter = async function (name, email, address, contact, request, response, next) {
 function checkifEmpty() {
  let query = 'SELECT * FROM CENTER';
  return new Promise((resolve, reject) => {
   connection.query(query, function (err, result) {
    if (err) { reject(err) };
    resolve(result.length == 0 ? true : false)
   })
  })
 }

 // update data if center details is present in db
 let truncateData = async function () {
  let query = `DELETE FROM CENTER
  `;

  connection.query(query, (err, result) => {
   if (err) throw err;
  })
 }

 // insert new data 
 const newInsertion = async function () {
  let query = `INSERT INTO CENTER (NAME,EMAIL,ADDRESS,CONTACT) VALUES(?,?,?,?,?,?)`;
  connection.query(query, [name, email, address, contact], (err, result) => {
   if (err) throw err;
   if (result) {
    next();
   }
  })

  let nextStep = await checkifEmpty().catch(err => { throw err })

  if (nextStep) {
   newInsertion();
  }
  else {
   truncateData();
   newInsertion();
  }
 }

 if (name && email && address && contact) {
  uploadCenter(name,email,address,contact,request,response,next);
 }
}