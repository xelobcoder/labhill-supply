const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
const products = require('./controllers/newProducts');
const PORT = process.env.PORT || 4000;
const imageConstruct = require('./controllers/image');
const { NewPayment, UpdatePayment } = require('./controllers/payments');
const Tax = require('./controllers/tax');
const AddTransaction = require('./controllers/transactions');
const renderCart = require('./controllers/singletransaction');
const customer = require('./controllers/customer');
const { deleteCustomers, getCustomers } = require('./controllers/customer');
const {addStock} = require("./controllers/stock.js")
// use cookie parser and express body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './public/')))
app.use(express.static(path.join(__dirname, './public/css')))
app.use(express.static(path.join(__dirname, './public/js')))
app.use(express.static(path.join(__dirname, './public/assert')))

// setting view engine
app.set('view engine', 'ejs')

app.get('/', function (request, response) { response.render('index') })
app.get("/newproduct", function (req, res) { res.render('nproduct.ejs') })
app.get('/centerprofile', function (req, res) { res.render('cprofile.ejs') })
app.listen(PORT, function (err) { if (err) throw err });


app.get("/api/v1/product", function (request, response) {
  products.getProduct(request, response);
})



const addImage = new imageConstruct('product');
app.post('/api/v1/product', addImage.upload().single('image'), function (request, response, next) {
  products.addProduct(request, response, request.file.filename, next);
})

app.put('/api/v1/product', function (request, response, next) {
  products.updateProduct(request, response, next)
})
app.delete('/api/v1/product', function (request, response, next) {
  products.deleteProduct(request, response, next)
})



// render view product page

app.get('/viewproducts', function (request, response) {
  response.render('viewproducts.ejs')
})

// get all product
app.get('/tax', function (request, response) {
  response.render('transactions.ejs')
})



// get single image 

app.get("/api/v1/image", function (request, response) {
  const imageid = request.query.id;
  response.sendFile(path.join(__dirname, '/public/asserts/product', imageid));
})


app.get('/api/v1/tax', function (request, response) {
  let tax = new Tax(request, response);
  // tax.getAllTax();
  const hasQueries = Object.keys(request.query).length;
  // if more than zero 
  if (hasQueries > 0) {
    if (Object.keys(request.query).includes('taxapplied') && Object.keys(request.query).includes('taxid')) {
      const { taxapplied, taxid } = request.query;
      if (taxapplied && taxid) {
        tax.updateTaxAppliedStatus(taxapplied, taxid);
      }
      else {
        response.send(request.query)
      }
    }


    if (Object.keys(request.query).includes('taxtoapply')) {
      tax.taxToApply();
    }


  }
  else {
    tax.getAllTax();
  }
})

app.post('/api/v1/tax', function (request, response) {
  let tax = new Tax(request, response);
  tax.addTax();
})

app.put('/api/v1/tax', function (request, response) {
  let tax = new Tax(request, response);
  tax.updateTax();
})

app.delete('/api/v1/tax', function (request, response) {
  let tax = new Tax(request, response);
  const id = request.body.taxid;
  tax.deleteTax(id);
})


app.post('/transaction', function (request, response, next) {
  AddTransaction(request, response, next);
})

app.get('/viewtransaction', function (request, response, next) {
  response.render('singletransaction.ejs')
})


app.get('/api/v1/transaction', function (request, response, next) {
  renderCart(request, response, next);
})

// page for new customer

app.get('/newcustomer', function (request, response) {
  response.render('newCustomer.ejs')
})


app.post('/api/v1/customers', function (request, response) {
  customer.addCustomer(request, response)
})

app.delete('/api/v1/customers', function (request, response) {
  deleteCustomers(request, response)
})

app.get('/api/v1/customers', function (request, response) {
  getCustomers(request, response)
})

app.get('/customers', function (request, response) {
  response.render('customers.ejs')
})


app.post('/api/v1/payments', function (request, response) {
  NewPayment(request, response);
})


app.get('/addstock',function(request,response) {
  response.render('addstock.ejs')
})


app.get('/api/v1/stock', function(request,response) {
  addStock(request,response)
})