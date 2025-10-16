// // controllers/eventController.js
// import { validationResult } from "express-validator";
// import Event from "../models/Event.js";

// // Create a new event
// export const createEvent = async (req, res) => {
//   // Check validation results
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }

//   try {
//     const { name, location, date } = req.body;
//     const event = new Event({ name, location, date });
//     await event.save();
//     res.status(201).json({ success: true, data: event });
//   } catch (err) {
//     console.error("Create Event Error:", err);
//     res.status(500).json({ success: false, error: "Server error while creating event" });
//   }
// };

// // Get all events
// export const getEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ date: -1 });
//     res.json({ success: true, count: events.length, data: events });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Get single event by ID
// export const getEventById = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ success: false, error: "Event not found" });
//     }
//     res.json({ success: true, data: event });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// // Update event
// export const updateEvent = async (req, res) => {
//   // Check validation results
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }

//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!updatedEvent) {
//       return res.status(404).json({ success: false, error: "Event not found" });
//     }
//     res.status(200).json({ success: true, data: updatedEvent });
//   } catch (err) {
//     console.error("Update Event Error:", err);
//     res.status(500).json({ success: false, error: "Server error while updating event" });
//   }
// };

// // Delete event
// export const deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndDelete(req.params.id);
//     if (!event) {
//       return res.status(404).json({ success: false, error: "Event not found" });
//     }
//     res.json({ success: true, message: "Event deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// };
// controllers/eventController.js
import { validationResult } from "express-validator";
import Event from "../models/Event.js";

// Helper: sanitize input to prevent XSS
const sanitizeInput = (str) => {
  if (!str) return "";
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Create a new event
export const createEvent = async (req, res) => {
  // Check validation results from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, location, date } = req.body;

    const event = new Event({
      name: sanitizeInput(name),
      location: sanitizeInput(location),
      date,
    });

    await event.save();
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(500).json({ success: false, error: "Server error while creating event" });
  }
};

// Get all events (safe query)
export const getEvents = async (req, res) => {
  try {
    // Only allow plain text search to prevent NoSQL injection
    const query = {};
    if (req.query.name) {
      query.name = { $regex: req.query.name, $options: "i" };
    }

    const events = await Event.find(query).sort({ date: -1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update event
export const updateEvent = async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const updateData = {
      name: sanitizeInput(req.body.name),
      location: sanitizeInput(req.body.location),
      date: req.body.date,
    };

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) return res.status(404).json({ success: false, error: "Event not found" });

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(500).json({ success: false, error: "Server error while updating event" });
  }
};

// Delete event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: "Event not found" });
    res.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
