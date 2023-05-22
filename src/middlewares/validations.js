const { body, param } = require('express-validator');

const userValidations = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .matches(/@gmail\.com$/)
    .withMessage('Email must be a Gmail account'),
  /*body('dni')
    .isNumeric()
    .withMessage('DNI must be a numeric value')
    .isLength({ min: 8 })
    .withMessage('DNI must contain at least 8 digits'),*/
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('role').notEmpty().withMessage('El rol es obligatorio'),
];

const credentialsValidations = [
  body('email')
    .notEmpty()
    .withMessage('El email es obligatorio')
    .isEmail()
    .withMessage('Correo electrónico no válido')
    .matches(/@gmail\.com$/)
    .withMessage('El correo electrónico debe ser una cuenta de Gmail'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
];

const createRoleValidations = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('permissions')
    .isArray()
    .withMessage('Los permisos deben ser un arreglo'),
  body('isActive').isBoolean().withMessage('isActive debe ser booleano'),
];

const updateRoleValidations = [
  param('id').notEmpty().withMessage('El ID del rol es obligatorio'),
  body('name').optional().notEmpty().withMessage('El nombre es obligatorio'),
  body('permissions')
    .optional()
    .isArray()
    .withMessage('Los permisos deben ser un arreglo'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive debe ser booleano'),
];

module.exports = {
  userValidations,
  credentialsValidations,
  updateRoleValidations,
  createRoleValidations,
};
