//main is that it stops reaching bad data to controller
//here body-> values to check and validationResult -> rules to check
const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["learner", "contributor"])
    .withMessage("Invalid role"),
  validate,
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const moduleValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().trim(),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be positive"),
  validate,
];

const lessonValidator = [
  body("moduleID").isMongoId().withMessage("Valid module ID is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("explanation").optional().trim(),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be positive"),
  validate,
];

const progressValidator = [
  body("lessonid").isMongoId().withMessage("Valid lesson ID is required"),
  validate,
];

const suggestionValidator = [
  body("lessonid").isMongoId().withMessage("Valid lesson ID is required"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Suggestion text is required")
    .isLength({ min: 10 })
    .withMessage("Suggestion must be at least 10 characters"),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  moduleValidator,
  lessonValidator,
  progressValidator,
  suggestionValidator,
};
