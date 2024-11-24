/**
 * The validation.js file contains middleware functions
 * that perform validation controls on incoming http requests.
 */

const { check } = require("express-validator");
const validationErrorMsgs = require("../config/validationErrorMsgs");
const authMsgs = require("../config/authMsgs");

const passwordRegex = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/
);
const idRegex = new RegExp(/^[0-9a-fA-F]{1,}$/);

// Validation rules for user registration
const userRegistrationRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(validationErrorMsgs.USERNAME_REQUIRED)
      .isLength({ min: 3 })
      .withMessage(validationErrorMsgs.USERNAME_MIN_LENGTH)
      .isLength({ max: 20 })
      .withMessage(validationErrorMsgs.USERNAME_MAX_LENGTH),
    check("email")
      .notEmpty()
      .withMessage(validationErrorMsgs.EMAIL_REQUIRED)
      .isEmail()
      .withMessage(validationErrorMsgs.EMAIL_INVALID),
    check("password")
      .notEmpty()
      .withMessage(validationErrorMsgs.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(validationErrorMsgs.PASSWORD_MIN_LENGTH)
      .matches(passwordRegex)
      .withMessage(validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS),
  ];
};

// User login rules
const userLoginRules = () => {
  return [
    check("username")
      .notEmpty()
      .withMessage(validationErrorMsgs.USERNAME_REQUIRED)
      .isLength({ min: 3 })
      .withMessage(validationErrorMsgs.USERNAME_MIN_LENGTH)
      .isLength({ max: 20 })
      .withMessage(validationErrorMsgs.USERNAME_MAX_LENGTH),
    check("password")
      .notEmpty()
      .withMessage(validationErrorMsgs.PASSWORD_REQUIRED)
      .isLength({ min: 7 })
      .withMessage(validationErrorMsgs.PASSWORD_MIN_LENGTH)
      .matches(passwordRegex)
      .withMessage(validationErrorMsgs.PASSWORD_MUST_HAVE_CHARACTERS),
  ];
};

// Task creation rules
const taskCreationRules = () => {
  return [
    check("title")
      .notEmpty()
      .withMessage(validationErrorMsgs.TITLE_REQUIRED)
      .isLength({ max: 100 })
      .withMessage(validationErrorMsgs.TITLE_MAX_LENGTH),
    check("description")
      .optional()
      .isLength({ max: 300 })
      .withMessage(validationErrorMsgs.DESCRIPTION_MAX_LENGTH),
    check("status")
      .notEmpty()
      .withMessage(validationErrorMsgs.STATUS_REQUIRED)
      .isIn(["pending", "complete"])
      .withMessage(validationErrorMsgs.STATUS_INVALID),
    check("username")
      .notEmpty()
      .withMessage(validationErrorMsgs.USERNAME_REQUIRED),
  ];
};

// Task update rules
const taskUpdateRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMsgs.ID_REQUIRED)
      .matches(idRegex)
      .withMessage(validationErrorMsgs.ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMsgs.ID_LENGTH),
    check("title")
      .optional()
      .isLength({ max: 100 })
      .withMessage(validationErrorMsgs.TITLE_MAX_LENGTH),
    check("description")
      .optional()
      .isLength({ max: 300 })
      .withMessage(validationErrorMsgs.DESCRIPTION_MAX_LENGTH),
    check("status")
      .optional()
      .isIn(["pending", "complete"])
      .withMessage(validationErrorMsgs.STATUS_INVALID),
    check("username")
      .optional()
      .notEmpty()
      .withMessage(validationErrorMsgs.USERNAME_REQUIRED),
  ];
};

// Task deletion rules
const taskDeletionRules = () => {
  return [
    check("id")
      .notEmpty()
      .withMessage(validationErrorMsgs.ID_REQUIRED)
      .matches(idRegex)
      .withMessage(validationErrorMsgs.ID_INVALID)
      .isLength({ min: 24, max: 24 })
      .withMessage(validationErrorMsgs.ID_LENGTH),
  ];
};

// Header validation rules
const headerValidationRules = () => {
  return [
    check("Authorization")
      .notEmpty()
      .withMessage(authMsgs.AUTH_HEADER_REQUIRED),
  ];
};

module.exports = {
  userRegistrationRules,
  userLoginRules,
  taskCreationRules,
  taskUpdateRules,
  taskDeletionRules,
  headerValidationRules,
};
