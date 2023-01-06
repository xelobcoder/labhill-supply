const connection = require('./db');
const fs = require('fs');
// connection to database created

// check if price and quantity are pure numbers
const isNumber = function (number) {
	return typeof parseInt(number) == 'number' ? number : false;
}

// add new products
const addProduct = function (req, res, imageid, next) {
	const { name, quantity, description, price, minqty, nprice } = req.body;
	console.log(req.body);

	if (!name && !quantity && !description) {
		res.status(404).send('name,quantity and description all required');
	}

	if (name, quantity, description, price) {

		if (isNumber(quantity) && isNumber(price)) {
			// add data to database;
			let query = 'INSERT INTO product (NAME,QUANTITY,PRICE,DESCRIPTION,IMAGEID,minqty,noprofitprice) VALUES (?,?,?,?,?,?,?)';
			// connect
			connection.query(query, [name, quantity, price, description, imageid, minqty, nprice], (err, result) => {
				if (err) {
					res.send(err)
				}
				if (result) {
					res.send({
						status: 'success',
						message: 'product added successfully'
					});
				}
			})
		}
	}
}

// updateproducts
const updateProduct = function (req, res, next) {
	const updateDB = function (id, name, quantity, price, description, imageid) {
		let query = 'UPDATE product SET NAME=?,QUANTITY=?,PRICE=?,DESCRIPTION=?,IMAGEID=? WHERE ID=?';
		connection
			.query(query
				, [name, quantity, price, description, imageid, id]
				, (err, result) => {
					if (err) {
						res.send(err)
					}
					if (result) {
						res.send('product updated');
					}
				}
			)
	}

	// check if product exist in database

	const checkProduct = function (id) {
		let query = 'SELECT * FROM product WHERE ID=?';
		return new Promise((resolve, reject) => {
			connection.query(query, [id], (err, result) => {
				if (err) {
					res.send(err)
				}
				if (result) {
					if (result.length <= 0) {
						// product does not exist
						resolve({ status: false })
					} else {
						// product exist
						resolve({ status: true, data: result[0] })
					}
				}
			})
		})
	}


	const overWriteImage = async function (type) {
		let productExist = await checkProduct(req.body.id);

		if (productExist.status) {
			// delete existing image
			let image = productExist.data.IMAGEID;
			let path = path.join('./public/asserts', type, image);
			fs.unlink(path, (err) => {
				if (err) {
					console.log(err);
				}
			})
		}
		// upload new image
		if (req.file) {
			// upload new image
			let addImage = new imageConstruct(req.file);
			let image = await addImage.upload().single('image');

			const { id, name, quantity, price, description } = req.body;
			updateDB(id, name, quantity, price, description, image.filename);
		} else {
			// use existing image
			const { id, name, quantity, price, description } = req.body;
			updateDB(id, name, quantity, price, description, productExist.data.IMAGEID);
		}
	}
}


// delete products
const deleteProduct = function (req, res, next) {
	const { productid } = req.body;
	let query = 'DELETE FROM product WHERE productid=?';

	// check if productid is an array
	const isArray = Array.isArray(productid);
	if (isArray) {
		// delete multiple products
		function deeletion(id) {
			// make connection
			connection.query(query, [id], function (err, result) {
				if (err) {
					throw err;
				}
				return
			})
		}
		// create a counter
		let counter = 0;
		// target
		let target = productid.length;

		while (counter < target) {
			deeletion(productid[counter])
			counter++;
		}
		res.send({
			message: 'items successfully deleted'
		})
	}

}



// get products
const getProduct = function (req, res, next) {
	let query = 'SELECT * FROM product';
	connection
		.query(query
			, (err, result) => {
				if (err) {
					res.send(err)
				}
				if (result) {
					res.send(result);
				}
			}
		)
}








module.exports = {
	updateProduct,
	addProduct,
	getProduct,
	deleteProduct
}