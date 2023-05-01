const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');

const rolesController = require('../../controllers/roles/role.controller');

// Crear rol
router.post('/create_role', authMiddleware, rolesController.createRole);

// Listar roles
router.get('/getallRoles', authMiddleware, rolesController.getRoles);

// Obtener rol por ID
router.get('/:id', authMiddleware, rolesController.getRoleById);

// Actualizar rol
router.put('/:id', authMiddleware, rolesController.updateRole);

module.exports = router;
