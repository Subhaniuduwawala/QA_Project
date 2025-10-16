// routes/admin.js
import express from "express";
import { signupAdmin, loginAdmin } from "../controllers/adminController.js"; // note .js extension

const router = express.Router();

// ✅ Admin signup
router.post("/signup", signupAdmin);

// ✅ Admin login
router.post("/login", loginAdmin);

// Export default for ES modules
export default router;


