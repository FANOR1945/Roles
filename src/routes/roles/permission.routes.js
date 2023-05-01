const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const permissionsController = require('../../controllers/roles/permission.controller');

// Crear permiso
router.post(
  '/create_permission',
  authMiddleware,
  permissionsController.createPermission
);

// Listar permisos
router.get(
  '/getallPermissions',
  authMiddleware,
  permissionsController.getPermissions
);

// Obtener permiso por ID
router.get('/:id', authMiddleware, permissionsController.getPermission);

// Actualizar permiso
router.put('/:id', authMiddleware, permissionsController.updatePermission);

module.exports = router;
