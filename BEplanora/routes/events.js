// routes/events.js
import express from "express";
import { body } from "express-validator"; // import validator
import * as eventController from "../controllers/eventController.js";

const router = express.Router();

// ✅ Create Event with validation and XSS protection
router.post(
  "/",
  body("name").trim().escape().notEmpty().withMessage("Event name is required"),
  body("location").trim().escape().notEmpty().withMessage("Location is required"),
  body("date").isISO8601().toDate().withMessage("Valid date is required"),
  eventController.createEvent
);

// ✅ Update Event with optional validation
router.put(
  "/:id",
  body("name").optional().trim().escape(),
  body("location").optional().trim().escape(),
  body("date").optional().isISO8601().toDate(),
  eventController.updateEvent
);

// ✅ Other routes
router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);
router.delete("/:id", eventController.deleteEvent);

export default router;
