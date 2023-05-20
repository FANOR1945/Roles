const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const checkPermissionMiddleware = require('../../middlewares/checkPermission.middleware');
const userController = require('../../controllers/users/user.controller');
const adminController = require('../../controllers/users/admin.controller');

router.post(
  '/create_user',
  authMiddleware,
  checkPermissionMiddleware(['Gestión de Usuarios']),
  userController.createUser
);

router.get('/getAllu', authMiddleware, userController.getAllUsers);

router.get('/:id', authMiddleware, userController.getUser);

router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deactivateUser);

router.patch('/:id/activateu', authMiddleware, userController.activateUser);

//administrators

router.post(
  '/create_user_admin',
  authMiddleware,
  checkPermissionMiddleware(['Gestión de Usuarios']),
  adminController.createAdminUser
);

module.exports = router;
