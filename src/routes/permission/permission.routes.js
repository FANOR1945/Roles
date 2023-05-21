const express = require('express');
const router = express.Router();
const verifyMiddleware = require('../../middlewares/verify.middleware');
const permissionsController = require('../../controllers/permissions/permission.controller');

// Crear permiso
router.post(
  '/create_permission',
  verifyMiddleware,
  permissionsController.createPermission
);

// Listar permisos
router.get(
  '/getAllp',
  verifyMiddleware,
  permissionsController.getAllPermissions
);

// Obtener permiso por ID
router.get('/:id', verifyMiddleware, permissionsController.getPermission);

// Actualizar permiso
router.put('/:id', verifyMiddleware, permissionsController.updatePermission);

module.exports = router;
