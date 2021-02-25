'use strict'
const $user = require('../models/user');

const _verifySignUp = {
	checkDuplicateUsernameOrEmail : (req, res, next) => {
	  // Username
	  $user.findOne({
	    username: req.body.username
	  }).exec((err, user) => {
	    if (err) {
	      return res.status(500).send({ message: err });
	    }

	    if (user != null) {
	      return res.status(400).send({ message: "Failed! Username is already in use!" });
	    }

	    // Email
	    $user.findOne({
	      email: req.body.email
	    }).exec((err, user) => {
	      if (err) {
	        return res.status(500).send({ message: err });
	      }

	      if (user != null) {
	        return res.status(400).send({ message: "Failed! Email is already in use!" });
	      }

	      next();
	    });
	  });
	}
}

module.exports = _verifySignUp;