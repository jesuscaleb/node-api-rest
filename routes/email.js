const express = require('express');

const router = express.Router();

const EmailController = require('../controllers/email');

// Ruta para envío de email
router.post('/send', EmailController.sendEmail);

module.exports = router;
