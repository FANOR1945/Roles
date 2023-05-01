const express = require('express');
const router = express.Router();
const userController = require('../../controllers/roles/user.controller');
//const authMiddleware = require('../middlewares/auth.middleware');

// Ruta para crear un nuevo usuario
router.post('/users', userController.registerUser);

module.exports = router;
