const express = require('express');
const router = express.Router();
const verifyMiddleware = require('../../middlewares/verify.middleware');
const checkPermissionMiddleware = require('../../middlewares/checkPermission.middleware');
const userController = require('../../controllers/users/user.controller');
const adminController = require('../../controllers/users/admin.controller');

router.post(
  '/create_user',
  verifyMiddleware,
  checkPermissionMiddleware(['Gestión de Usuarios']),
  userController.createUser
);

router.get('/getAllu', verifyMiddleware, userController.getAllUsers);

router.get('/:id', verifyMiddleware, userController.getUser);

router.put('/:id', verifyMiddleware, userController.updateUser);
router.delete('/:id', verifyMiddleware, userController.deactivateUser);

router.patch('/:id/activateu', verifyMiddleware, userController.activateUser);

//administrators

router.post(
  '/create_user_admin',
  verifyMiddleware,
  checkPermissionMiddleware(['Gestión de Usuarios']),
  adminController.createAdminUser
);

module.exports = router;
