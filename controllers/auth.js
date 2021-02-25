'use strict';

const config = require('../config/auth.config');
const globalService = require('../services/globalService');
const $user = require('../models/user');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');


const _auth = {
	signUp: (req, res) => {
		var params = req.body;
		try {
			var first_valid = !validator.isEmpty(params.first);
			var last_valid = !validator.isEmpty(params.first);
			var username_valid = !validator.isEmpty(params.username);
			var email_valid = validator.isEmail(params.email);
			var password_valid = validator.isStrongPassword(params.password);
		} catch(err) {
			return res.status(500).send({
		        status: "error",
		        message: "Validation error.",
		        error: err
	        });			
		}

		const valid_params = [{
			first : first_valid,
			last : last_valid,
			username : username_valid,
			email : email_valid,
			password : password_valid
		}]

		let userParamsValid = globalService.checkObjValuesTrue(params);

		if(userParamsValid){	

			const user = new $user({
				first : params.first,
				last : params.last,
				username : params.username,
				email : params.email,
				password : bcrypt.hashSync(params.password, 8),
				permissions : params.permissions
			});

			user.save((err, userStored)=> {
				if (err || !userStored) {
		          return res.status(404).send({
		            status: "error",
		            message: "User has not been registered.",
		            error: err
		          });
		        }

		        return res.status(200).send({
		          status: "success",
		          user: userStored,
		          message: "User has been registered successfully"
		        });
			});
		} else {
			return res.status(200).send({
		        status: "error",
		        message: "Invalid data."
	      	});
		}
	},
	logIn: (req, res) => {
		let email = req.body.email;
		let username = req.body.username;  
		var data;
		var permissions;

		try{
			if (username != undefined) { var username_valid = !validator.isEmpty(username); }
			if (email != undefined){ var email_valid = validator.isEmail(email); }
		}catch(err){
			return res.status(200).send({
		        status: "error",
		        message: "Parameters are not valid.",
		        error : err
		      });
		}

		if(username_valid){
			data = {
				username : username
			};
		}else if(email_valid){
			data = {
				email : email
			};
		}

		$user.findOne(data)
		.exec((err, user) => {

			if (err) {
				return res.status(500).send({
		        	status: "error",
		        	error: err
	      		});
			}

			if (!user) {
				return res.status(404).send({
		        	status: "error",
		        	message: "User not found."
	      		});	
			}

			let passwordIsValid = bcrypt.compareSync(
				req.body.password,
				user.password
			);

			if(!passwordIsValid){
				return res.status(401).send({
		          bearerToken: null,
		          message: "Invalid Password!"
		        });
			}

			let token = jwt.sign({sub:user._id}, config.secret, {
		        expiresIn: 3600 // seconds
	      	});

	      	let data = {
	      		username: username,
		        accessToken: token,
		        permissions: user.permissions,
		        publicKey : config.public
	      	}

			return res.status(200).send(data);
		});
	}
}

module.exports = _auth;