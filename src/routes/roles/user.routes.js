const express = require('express');
const router = express.Router();
const userController = require('../../controllers/roles/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkPermissionsMiddleware = require('../../middlewares/checkPermission.middleware');

router.post('/create_user', userController.registerUser);

router.get('/allUsers', authMiddleware, userController.getAllUsers);

router.get('/:id', authMiddleware, userController.getUser);

router.put(
  '/:id',
  checkPermissionsMiddleware('modificar'),
  authMiddleware,

  userController.updateUser
);

router.delete('/:id', authMiddleware, userController.deleteUser);
module.exports = router;
