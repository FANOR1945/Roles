const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');

const rolesController = require('../../controllers/roles/role.controller');

// Crear rol
router.post('/create_role', authMiddleware, rolesController.createRole);

// Listar roles
router.get('/getAllr', authMiddleware, rolesController.getAllRoles);

// Obtener rol por ID
router.get('/:id', authMiddleware, rolesController.getRole);

// Actualizar rol
router.put('/:id', authMiddleware, rolesController.updateRole);
router.delete('/:id', authMiddleware, rolesController.deleteRole);

module.exports = router;
