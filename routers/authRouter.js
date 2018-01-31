
// require javascript helper libraries
const faker = require('faker');
const waterfall = require('async/waterfall');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const __ = require('lodash');

// require mongoose models
const User = require('../models/user');
const Employee = require('../models/employee');

// require passport.js services
const Authentication = require('../authentication/authentication');
const passportService = require('../services/passport');
const passport = require('passport');

// import passport jwt strategies
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function (app) {

	app.post('/login', requireLogin, Authentication.login);
	// Before the user can actually log in (Authentication.login)
  // the passwords are compared in the local stratgey requireSignin

  //This middleware is using the authentication controller in authentication.js, not passport
	app.post('/signup', Authentication.signup);

	// forgot password route, assigns user a reset token and sends email
	// email will contain a link to the '/reset/:token' route below
	app.post('/forgotPassword', function(req, res, next) {

		var queryParams = req.query;

		if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
			var employeeRequest = true;
		}

		waterfall([
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
		},
		function(token, done) {

			// check to see if this is an employee reset request
			// admin requests have no query parameters
			if (employeeRequest) {

				var employeeEmail = queryParams.q;

				Employee.findOne({ email: employeeEmail }, function(err, user) {

					if (!user) {
						res.status(404).json("No employee with that email exists");
					}
					user.resetPasswordToken = token;
	        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

	        user.save(function(err) {
	          done(err, token, user);
	        });
				});
			} else {
				// this is an admin reset request
				User.findOne({ email: req.body.email }, function(err, user) {

					if (!user) {
						res.status(404).json("No user with that email exists");
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function(err) {
						done(err, token, user);
					});
				});
			}

    },
		function(token, user, done) {

		    var smtpTransport = nodemailer.createTransport('SMTP', {
		      service: 'SendGrid',
		      auth: {
		        user: process.env.SEND_USER,
		        pass: process.env.SEND_PASS
		      }
		    });

				if (employeeRequest) {
					// employee request so send employee route
					var resetRoute = '/forgotEmployee/';
				} else {
					// admin request so send admin route
					var resetRoute = '/forgot/';
				}

		    var mailOptions = {
		      to: user.email,
		      from: 'admin@hellohealthgroup.com',
		      subject: 'Hello Bacsi P.O.S. Password Reset',
		      text: `Hi ${user.profile.name},
								 We received a request to reset your Hello Bacsi P.O.S. system password.
								 \n
								 To start the process, please click the following link:
								 http://${req.headers.host}${resetRoute}${token}
								 \n
								 If the above link doesn’t take you to our password reset page,
								 copy and paste the URL in a new browser window.
								 \n
								 The URL will expire in 1 hour for security reasons.
								 If you didn’t make this request, simply ignore this message.`
		    };

		  	smtpTransport.sendMail(mailOptions, function(err) {
		    	done(err, 'done');
		  	});
    	}
		], function(err) {
			if (err) return next(err);
			res.status(200).json("Email sent");
		})

	});

	// POST resetPassword route actually changes the user's password in the database
	app.post('/resetPassword/:token', function(req, res) {

	  waterfall([
	    function(done) {

				User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	        if (!user) {
	          res.status(401).json("Reset token may have expired");
	        }

	        user.password = req.body.password;
	        user.resetPasswordToken = undefined;
	        user.resetPasswordExpires = undefined;

	        user.save(function(err) {
	          if (err) { next(err); }
						done(err, user);
	        });
	      });

	    },
	    function(user, done) {
	      var smtpTransport = nodemailer.createTransport('SMTP', {
	        service: 'SendGrid',
	        auth: {
	          user: process.env.SEND_USER,
	          pass: process.env.SEND_PASS
	        }
	      });
	      var mailOptions = {
	        to: user.email,
	        from: 'admin@hellohealthgroup.com',
	        subject: 'Hello Bacsi P.O.S. Password Changed',
	        text: `Hello ${user.profile.name},\n
								 This is a confirmation that the password for your account, ${user.email},
								 has just been changed.`
	      };
	      smtpTransport.sendMail(mailOptions, function(err) {
	        done(err);
	      });
	    }
	  ], function(err) {
	    res.status(200).json("Your password has been successfully reset!");
	  });
	});


	// fetchUser will return the user based on the jwt that is currently stored in localStorage
	// that user is found in the middleware requireAuth and returned ont he req object
	app.get('/fetchUser', requireAuth, function(req, res, next) {
		res.json(req.user);
	});

} // end module.exports
