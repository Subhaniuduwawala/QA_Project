// routes/events.js
import express from "express";
import { body } from "express-validator"; // import validator
import * as eventController from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js"; // Import auth middleware

const router = express.Router();

// ✅ Create Event with validation, XSS protection, and authentication
router.post(
  "/",
  protect, // Require authentication
  body("name").trim().escape().notEmpty().withMessage("Event name is required"),
  body("location").trim().escape().notEmpty().withMessage("Location is required"),
  body("date").isISO8601().toDate().withMessage("Valid date is required"),
  eventController.createEvent
);

// ✅ Update Event with optional validation and authentication
router.put(
  "/:id",
  protect, // Require authentication
  body("name").optional().trim().escape(),
  body("location").optional().trim().escape(),
  body("date").optional().isISO8601().toDate(),
  eventController.updateEvent
);

// ✅ Delete Event with authentication
router.delete("/:id", protect, eventController.deleteEvent);

// ✅ Public routes (read-only)
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

export default router;
