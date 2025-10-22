// routes/admin.js
import express from "express";
import { body } from "express-validator";
import { signupAdmin, loginAdmin } from "../controllers/adminController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Admin signup with validation
router.post(
  "/signup",
  [
    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
      .withMessage("Password must contain uppercase, lowercase, number, and special character"),
    body("firstName")
      .trim()
      .isString()
      .notEmpty()
      .escape()
      .withMessage("First name is required"),
    body("lastName")
      .trim()
      .isString()
      .notEmpty()
      .escape()
      .withMessage("Last name is required"),
  ],
  signupAdmin
);

// Admin login with validation and rate limiting
router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .isString()
      .withMessage("Email must be a string")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("password")
      .isString()
      .withMessage("Password must be a string")
      .notEmpty()
      .withMessage("Password is required"),
  ],
  loginAdmin
);

export default router;
