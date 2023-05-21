const express = require('express');
const authController = require('../../controllers/auth/auth.controller');
const verifyMiddleware = require('../../middlewares/verify.middleware.js');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', authController.login);
// Ruta para obtener el perfil del usuario
router.get('/profile', verifyMiddleware, authController.getProfile);

// Ruta para cerrar sesión
router.post('/logout', verifyMiddleware, authController.logout);
module.exports = router;
