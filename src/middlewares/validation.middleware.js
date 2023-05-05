const { validationResult } = require('express-validator');
const {
  userValidations,
  createRoleValidations,
  updateRoleValidations,
} = require('./validations');

const validationMiddleware = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).json({ errors: errors.array() });
  };
};
const userValidationMiddleware = validationMiddleware(userValidations);

const createRoleValidationMiddleware = validationMiddleware(
  createRoleValidations
);

const updateRoleValidationsMiddleware = validationMiddleware(
  updateRoleValidations
);

module.exports = {
  userValidationMiddleware,
  createRoleValidationMiddleware,
  updateRoleValidationsMiddleware,
};
