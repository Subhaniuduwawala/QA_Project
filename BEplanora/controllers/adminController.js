// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Admin from "../models/Admin.js";

// @desc    Signup a new admin
// @route   POST /api/admin/signup
// @access  Public
export const signupAdmin = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Type checking - prevent NoSQL injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid input format" 
      });
    }

    // check if admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ 
        success: false,
        message: "Admin already exists" 
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new admin
    const admin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    if (admin) {
      res.status(201).json({
        success: true,
        _id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
      });
    } else {
      res.status(400).json({ 
        success: false,
        message: "Invalid admin data" 
      });
    }
  } catch (error) {
    next(error); // Use error handler
  }
};

// @desc    Login admin
// @route   POST /api/admin/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Type checking - prevent NoSQL injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid input format" 
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      success: true,
      _id: admin.id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      token,
    });
  } catch (error) {
    next(error); // Use error handler
  }
};
