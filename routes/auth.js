'use strict'

const express = require('express');

const router = express.Router();

const verifySignUp = require('../middleware/verifySignUp');

const AuthController = require('../controllers/auth');

router.post('/signup', verifySignUp.checkDuplicateUsernameOrEmail , AuthController.signUp);
router.post('/login', AuthController.logIn);

module.exports = router;