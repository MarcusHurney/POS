const jwt = require('jwt-simple');
const __ = require('lodash');
const faker = require('faker');
//This will contain the user class, so it contains all instances of user
const User = require('../models/user');
const Product = require('../models/product');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	//The first argument is the info we want to encode and the second is the secret string for decryption
	// sub = subject, who is the subject of the token? The user, iat = issued at
	return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

exports.login =  function(req, res, next) {
	//user has already had email and password auth'ed, the user is returned from passport's localLogin function as req.user

	//Time to assign a jwt (log them in)
	res.send({ token: tokenForUser(req.user), user: req.user });
}

exports.signup = function(req, res, next) {

	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;
	const company = req.body.company;
	const address = req.body.address;

	// If the user forgets to provide an email, password
	// 422 means data can't be processed
	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide both email and password' });
	}

	//See if a user with the given email exists, no duplicates

	User.findOne({ email: email }, function (err, existingUser) {
		if (err) {return next(err); }

		// If a user with email does exist, return an error
		// 422 means data can't be processed
		if (existingUser) {
			return res.status(422).send({ error: 'Email is already in use' });
		}

		//If a user with email does NOT exist, create and save user record

		const user = new User({ //This creates the new user but does not save it to the DB
			email: email,
			company: company,
			password: password,
			address: address,
			profile: { name: name}
		});

		// create 500 fake products for the new user
		// each product's owner key will be associated with
		// this new user's id
		__.times(500, index => {

			var product = new Product();

			if (index <= 100) {
				product.category = 'pharmaceutical';
			} else if (index > 100 && index <= 200) {
				product.category = 'herbal';
			} else if (index > 200 && index <= 300) {
				product.category = 'OTC';
			} else if (index > 300 && index <= 400) {
				product.category = 'consumer';
			} else if (index > 400 && index <= 500) {
				product.category = 'herbal';
			}

			product.owner = user._id;
			product.name = faker.commerce.productAdjective();
			product.subCategory = faker.commerce.productAdjective();
			product.brand = faker.commerce.productAdjective();
			product.tax = 10;
			product.interactions = "Do not take with alcohol";
			product.healthConditions = "Check with your physician";
			product.locationOfProduct = faker.commerce.productAdjective();
			product.manufacturer = faker.commerce.productAdjective();
			product.manufacturerCountry = faker.commerce.productAdjective();
			product.ingredients = faker.commerce.productAdjective();
			product.price = 115;
			product.dosageForm = faker.commerce.productAdjective();
			product.typeOfProduct = faker.commerce.productAdjective();
			product.quantity = 500;
			product.description = "Enter product description here";
			product.save();
		});


		//save new user to the database
		user.save(function(err) {
			if (err) { return next(err); }

			//Response returns the a jwt to the user (contains user id, and special string for decryption purposes)
			res.json({ token: tokenForUser(user), user: user });
		});

	});

}
