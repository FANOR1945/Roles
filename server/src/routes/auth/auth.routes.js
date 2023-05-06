const express = require('express');
const authController = require('../../controllers/auth/auth.controller');

const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', authController.login);

module.exports = router;
