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

  },

  deleteCustomers(request, response) {
    const { id } = request.body;
    // check if is an array
    if (Array.isArray(id)) {
      // loop through array and delete each customer
      // using a while loop
      let i = 0;
      while (i < id.length) {
        const deleteCustomer = `DELETE FROM customer WHERE id = ${id[i]}`;
        connectiondb.query(deleteCustomer, (err, result) => {
          if (err) {
            response.send({
              status: 'error',
              message: 'An error occured while deleting customer'
            });
            throw new Error(err);
          }
        })
        // i = i + 1;
        i++;
        // send response if loop is done
        if (i === id.length) {
          response.send({
            status: 'success',
            message: 'Customers deleted successfully'
          });
        }
      }
    }
    else {
      // delete single customer
      const deleteCustomer = `DELETE FROM customer WHERE id = ${id}`;
      connectiondb.query(deleteCustomer,
        (err, result) => {
          if (err) {
            response
              .status(500)
              .send({
                status: 'error',
                message: 'An error occured while deleting customer'
              });
            return false;
          }
          if (result) {
            response.send({
              status: 'success',
              message: 'Customer deleted successfully'
            });
          }
        })
    }

  },
  getCustomers(request, response) {
    const getCustomers = `SELECT * FROM customer`;
    connectiondb.query(getCustomers, (err, result) => {
      if (err) {
        response
          .status(500)
          .send({
            status: 'error',
            message: 'An error occured while getting customers'
          });
        return false;
      }
      if (result) {
        response.send({
          status: 'success',
          data: result
        });
      }
    })
  }
}

module.exports = customer;