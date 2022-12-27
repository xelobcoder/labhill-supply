const connectiondb = require('./db.js');
const customer = {
  addCustomer(request, response) {
    const { name, email, phone, address, status } = request.body;
    // make request body iterable using 
    let itereableBody = Object.assign({}, request.body);
    // check all fields are filled
    for (let key in itereableBody) {
      if (itereableBody[key] === '') {
        response.send({
          status: 'incomplete',
          message: 'Please fill in all fields'
        });
        return false;
      }
    }
    // check if customer already exists
    const checkCustomer = `SELECT * FROM customer WHERE email = '${email}'`;
    connectiondb.query(checkCustomer, (err, result) => {
      if (err) {
        response
          .status(500)
          .send({
            status: 'error',
            message: 'An error occured while adding customer'
          });
        console.log(err);
        return false;
      }
      if (result.length > 0) {
        response.send({
          status: 'info',
          message: 'Customer already exists'
        });
        return false;
      }
      // add customer to database
      const addCustomer = `INSERT INTO customer (name, email, phone, address, status) VALUES ('${name}', '${email}', '${phone}', '${address}', '${status}')`;
      connectiondb.query(addCustomer
        , (err, result) => {
          if (err) {
            response
              .status(500)
              .send({
                status: 'error',
                message: 'An error occured while adding customer'
              });
            return false;
          }
          if (result) {
            response.send({
              status: 'success',
              message: 'Customer added successfully'
            });
          }
        }
      )
    })

  }
}

module.exports = customer;