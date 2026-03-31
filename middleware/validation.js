const { body, validationResult } = require("express-validator");
const {
  findUserByUsername,
  findUserByEmail,
} = require("../services/userServices");

module.exports.validateRegistration = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .bail()
    .matches(/^[a-zA-Z0-9_-]{3,30}$/)
    .withMessage("Usernames can only contain letters, numbers, _, and -")
    .bail()
    .custom(async (username) => {
      const user = await findUserByUsername(username);
      if (user) {
        throw new Error("Username is not available");
      }
    }),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .isLength({ max: 50 })
    .withMessage("Name must be under 50 characters")
    .bail()
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/)
    .withMessage("Name contains invalid characters"),
  body("email")
    .trim()
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("Invalid email address")
    .bail()
    .normalizeEmail()
    .custom(async (email) => {
      if (!email) {
        return true;
      }
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error("Email not available");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8-128 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports.validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
