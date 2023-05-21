const express = require('express');
const router = express.Router();
const verifyMiddleware = require('../../middlewares/verify.middleware');

const rolesController = require('../../controllers/roles/role.controller');

// Crear rol
router.post('/create_role', verifyMiddleware, rolesController.createRole);

// Listar roles
router.get('/getAllr', verifyMiddleware, rolesController.getAllRoles);

// Obtener rol por ID
router.get('/:id', verifyMiddleware, rolesController.getRole);

// Actualizar rol
router.patch('/:id', verifyMiddleware, rolesController.updateRole);

module.exports = router;
