const mysql = require('mysql');

const connection = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: '',
 database: 'db_lhs'
})




connection.connect(function (err) {
 if (err) throw err;
 console.log('connection to database successfull');
})


module.exports = connection;