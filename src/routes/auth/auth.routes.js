const express = require('express');
const authController = require('../../controllers/auth/auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware.js');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', authController.login);
// Ruta para obtener el perfil del usuario
router.get('/profile', authMiddleware, authController.getProfile);

// Ruta para cerrar sesión
router.post('/logout', authMiddleware, authController.logout);
module.exports = router;
