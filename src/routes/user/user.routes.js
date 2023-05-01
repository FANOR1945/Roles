const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const userController = require('../../controllers/users/user.controller');

router.post('/create_user', authMiddleware, userController.createUser);

router.get('/getAllu', authMiddleware, userController.getAllUsers);

router.get('/:id', authMiddleware, userController.getUser);

router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deactivateUser);

router.patch('/:id/activateu', authMiddleware, userController.activateUser);

module.exports = router;
