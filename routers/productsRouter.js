// require javascript helper libraries
const _ = require('underscore');
const faker = require('faker');
const __ = require('lodash');
const passport = require('passport');

// import route protection middleware
const requireAuth = passport.authenticate('jwt', { session: false });

// require mongoose models
const Product = require('../models/product');

module.exports = function(app) {

  // deletes 1 product associated with a single user by ID
	app.delete(`/deleteProduct/:productId`, requireAuth, function(req, res, next) {
		Product
		.remove({
			owner: req.user._id,
			_id: req.params.productId
		}, (err, deletedProduct) => {
			if (err) { return next(err); }

			res.status(200).json(deletedProduct);
		});
	});

  // Returns all products associated with a single user based
	// on their category, also checks for query parameter for pulling products by name
	app.get('/products/:category', requireAuth, function(req, res, next) {

		var queryParams = req.query;
		var filteredProducts;

			Product
			.find({
				owner: req.user._id,
				category: req.params.category
			})
			.exec(function(err, products) {

				filteredProducts = products;

				if (err) { return next(err); }

				if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

					filteredProducts = _.filter(products, function(product) {
						return product.name.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
					}); //The filteredProducts array will only contain product objects where the name contains the queryParameter.q
						//If the conditional attached to the return statement returns true, then the single product item it's checking gets added to filteredProducts array
				}

				const productsAscendingOrder = filteredProducts.sort((a, b) => {
					return b.numTimesSold - a.numTimesSold;
				});

				res.status(200).json(productsAscendingOrder);

			});
	});

	// returns all products associated with a single user
	app.get('/fetchAllProducts', requireAuth, function(req, res, next) {

		var queryParams = req.query;
		var filteredProducts;

		Product
		.find({ owner: req.user._id })
		.exec(function(err, products) {
			filteredProducts = products;

			if (err) { return next(err); }

			if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {

				filteredProducts = _.filter(products, function(product) {
					return product.name.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
				}); // The filteredProducts array will only contain product objects where the name contains the queryParameter.q
					 // If the conditional attached to the return statement returns true,
					// then the single product item it's checking gets added to filteredProducts array
			}

			const productsAscendingOrder = filteredProducts.sort((a, b) => {
				return b.numTimesSold - a.numTimesSold;
			});

			res.status(200).json(productsAscendingOrder);
		});
	});




	// Returns a single product associated with a single user
	// from the database based on product's id
	app.get('/fetchSingleProduct/:id', requireAuth, function(req, res, next) {

		Product
		.find({
	  	owner: req.user._id,
			_id: req.params.id
		})
		.then((product)=> {
			res.json(product);
		}, (error) => {
			return next(error);
		});

	});

 //This route updates an existing product's data
 app.put('/editProduct', requireAuth, function(req, res, next) {

	 Product
	 .findOne({
		 _id: req.body.productId,
		 owner: req.user._id
	 })
	 .then(product => {

		 product.name = req.body.name;
		 product.category = req.body.category;
		 product.subCategory = req.body.subCategory;
		 product.brand = req.body.brand;
		 product.locationOfProduct = req.body.locationOfProduct;
		 product.manufacturer = req.body.manufacturer;
		 product.manufacturerCountry = req.body.manufacturerCountry;
		 product.ingredients = req.body.ingredients;
		 product.price = req.body.price;
		 product.dosageForm = req.body.dosageForm;
		 product.typeOfProduct = req.body.typeOfProduct;
		 product.quantity = req.body.quantity;
		 product.description = req.body.description;

		 return product.save(function(err) {
			 if (err) { return next(err); }
			 return res.status(200).json(product); //Returns the sale so that it can be used in the sale_reducer.js
		 });
	 });

 });




	//creates a new product associated with a single user
	app.post('/createProduct', requireAuth, function(req, res, next) {

		var product = new Product();

		//This is the exact order in which the product model is defined in
		//models/product.js and also the exact order a new product's info is entered
		//in NewProductForm.js

		product.owner = req.user._id;
		product.name = req.body.name;
		product.category = req.body.category;
		product.subCategory = req.body.subCategory;
		product.tax = req.body.tax;
		product.interactions = req.body.interactions;
		product.healthConditions = req.body.healthConditions;
		product.brand = req.body.brand;
		product.locationOfProduct = req.body.locationOfProduct;
		product.manufacturer = req.body.manufacturer;
		product.manufacturerCountry = req.body.manufacturerCountry;
		product.ingredients = req.body.ingredients;
		product.price = req.body.price;
		product.dosageForm = req.body.dosageForm;
		product.typeOfProduct = req.body.typeOfProduct;
		product.quantity = req.body.quantity;
		product.description = req.body.description;


		product.save();

		return res.status(200).json("A new custom product was created");
	});

} // end module.exports
