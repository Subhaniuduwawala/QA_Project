// models/Event.js
import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true }); // optional: adds createdAt and updatedAt

export default mongoose.model("Event", EventSchema);
