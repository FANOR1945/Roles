const express = require('express');
const router = express.Router();
const userController = require('../../controllers/roles/user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const checkPermissionsMiddleware = require('../../middlewares/checkPermission.middleware');

router.post('/create_user', authMiddleware, userController.registerUser);

router.get('/getall', authMiddleware, userController.getAllUsers);

router.get('/:id', authMiddleware, userController.getUser);

router.put('/:id', authMiddleware, userController.updateUser);

router.delete('/:id', authMiddleware, userController.deleteUser);
module.exports = router;
