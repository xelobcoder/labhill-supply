const express = require('express');
const path = require('path');
const app = express();
const products = require('./controllers/newProducts');
const PORT = process.env.PORT || 4000;
const imageConstruct = require('./controllers/image');
const Tax = require('./controllers/tax');

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
app.get('/centerprofile', function(req,res) {res.render('cprofile.ejs')})
app.listen(PORT, function (err) { if (err) throw err });


app.get("/api/v1/product", function (request, response) {
 products.getProduct(request,response);
})


const addImage = new imageConstruct('product');
app.post('/api/v1/product', addImage.upload().single('image'), function(request,response,next) {
 products.addProduct(request,response,request.file.filename,next);
})

app.put('/api/v1/product', function(request,response,next) {
 products.updateProduct(request,response,next)
})
app.delete('/api/v1/product', function(request,response,next) {
 products.deleteProduct(request,response,next)
})



// render view product page

app.get('/viewproducts', function(request,response) {
 response.render('viewproducts.ejs')
})

// get all product
app.get('/tax', function(request,response) {
 response.render('transactions.ejs')
})



// get single image 

app.get("/api/v1/image" , function(request,response) {
 const imageid = request.query.id;
 response.sendFile(path.join(__dirname,'/public/asserts/product',imageid));
})


app.get('/api/v1/tax', function(request,response) {
  let tax = new Tax(request,response);
  tax.getAllTax();
})

app.post('/api/v1/tax', function(request,response) {
  let tax = new Tax(request,response);
  tax.addTax();
})

app.put('/api/v1/tax', function(request,response) {
  let tax = new Tax(request,response);
  tax.updateTax();
})