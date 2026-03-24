/**
 * Request validators — validates incoming data before it reaches controllers.
 */
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

const onboardingValidator = [
  body("riskProfile")
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("A valid risk profile is required"),
  body("literacyScore")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Literacy score must be between 0 and 100"),
  body("firstAsset.name").optional().trim().isLength({ min: 2 }).withMessage("Asset name must be at least 2 characters"),
  body("firstAsset.ticker").optional().trim().isLength({ max: 15 }).withMessage("Ticker cannot exceed 15 characters"),
  body("firstAsset.quoteSymbol").optional().trim().isLength({ max: 40 }).withMessage("Quote symbol cannot exceed 40 characters"),
  body("firstAsset.exchange").optional().trim().isLength({ max: 40 }).withMessage("Exchange cannot exceed 40 characters"),
  body("firstAsset.currency").optional().trim().isLength({ max: 10 }).withMessage("Currency cannot exceed 10 characters"),
  body("firstAsset.assetType")
    .optional()
    .isIn(["stock", "crypto", "etf", "bond", "mutual_fund", "commodity", "other"])
    .withMessage("Invalid asset type"),
  body("firstAsset.amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Asset amount must be a positive number"),
  body("firstAsset.purchasePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Purchase price cannot be negative"),
  validate,
];

const moduleValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("courseId").isMongoId().withMessage("Valid course ID is required"),
  body("description").optional().trim(),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be positive"),
  validate,
];

const lessonValidator = [
  body("moduleId").isMongoId().withMessage("Valid module ID is required"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("explanation").optional().trim(),
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Order must be positive"),
  validate,
];

const progressValidator = [
  body("lessonId").isMongoId().withMessage("Valid lesson ID is required"),
  validate,
];

const suggestionValidator = [
  body("lessonId").isMongoId().withMessage("Valid lesson ID is required"),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Suggestion text is required")
    .isLength({ min: 10 })
    .withMessage("Suggestion must be at least 10 characters"),
  validate,
];

const courseValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Order must be a positive integer"),
  body("isActive").optional().isBoolean().withMessage("isActive must be boolean"),
  validate,
];

const examValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Exam title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Exam description is required"),
  body("courseId")
    .optional()
    .isMongoId()
    .withMessage("Valid course ID is required"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("passingScore")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Passing score must be between 0 and 100"),
  body("duration")
    .optional()
    .isInt({ min: 10, max: 180 })
    .withMessage("Duration must be between 10 and 180 minutes"),
  validate,
];

const portfolioAssetValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Asset name is required")
    .isLength({ max: 100 })
    .withMessage("Asset name cannot exceed 100 characters"),
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("assetType")
    .optional()
    .isIn(["stock", "crypto", "etf", "bond", "mutual_fund", "commodity", "other"])
    .withMessage("Invalid asset type"),
  body("ticker")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Ticker cannot exceed 20 characters"),
  body("quoteSymbol")
    .optional()
    .trim()
    .isLength({ max: 40 })
    .withMessage("Quote symbol cannot exceed 40 characters"),
  body("exchange")
    .optional()
    .trim()
    .isLength({ max: 40 })
    .withMessage("Exchange cannot exceed 40 characters"),
  body("currency")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Currency cannot exceed 10 characters"),
  body("purchasePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Purchase price cannot be negative"),
  validate,
];

const watchlistItemValidator = [
  body("symbol")
    .trim()
    .notEmpty()
    .withMessage("Symbol is required")
    .isLength({ max: 20 })
    .withMessage("Symbol cannot exceed 20 characters"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),
  body("quoteSymbol")
    .optional()
    .trim()
    .isLength({ max: 40 })
    .withMessage("Quote symbol cannot exceed 40 characters"),
  body("exchange")
    .optional()
    .trim()
    .isLength({ max: 40 })
    .withMessage("Exchange cannot exceed 40 characters"),
  body("currency")
    .optional()
    .trim()
    .isLength({ max: 10 })
    .withMessage("Currency cannot exceed 10 characters"),
  body("assetType")
    .optional()
    .isIn(["stock", "crypto", "etf", "bond", "mutual_fund", "commodity", "other"])
    .withMessage("Invalid asset type"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
  validate,
];

const aiTextValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Text is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Text must be between 10 and 5000 characters"),
  validate,
];

const aiChatValidator = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 5000 })
    .withMessage("Message cannot exceed 5000 characters"),
  body("modeHint")
    .optional()
    .isIn(["auto", "chat", "news", "portfolio", "learning"])
    .withMessage("Invalid chat mode"),
  body("sessionId")
    .optional({ values: "falsy" })
    .isMongoId()
    .withMessage("Invalid session ID"),
  body("displayMessage")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Display message cannot exceed 500 characters"),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  onboardingValidator,
  moduleValidator,
  lessonValidator,
  progressValidator,
  suggestionValidator,
  courseValidator,
  examValidator,
  portfolioAssetValidator,
  watchlistItemValidator,
  aiTextValidator,
  aiChatValidator,
};
