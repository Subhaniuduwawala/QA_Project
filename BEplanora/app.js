// // app.js
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import cors from "cors";
// import connectDB from "./Config/db.js";

// // Import routes
// import eventsRoute from "./routes/events.js";
// import adminRoute from "./routes/admin.js";

// const app = express();

// // Connect to MongoDB
// connectDB().catch(err => {
//   console.error("Failed to connect to MongoDB:", err);
//   process.exit(1);
// });

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.use("/api/events", eventsRoute);
// app.use("/api/admin", adminRoute);

// // Health check
// app.get("/", (req, res) => {
//   res.send("University Event Management API is running");
// });

// export default app; // export for tests
// app.js
// app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";

// Import routes
import eventsRoute from "./routes/events.js";
import adminRoute from "./routes/admin.js";

const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventsRoute);
app.use("/api/admin", adminRoute);

// Health check
app.get("/", (req, res) => {
  res.send("University Event Management API is running");
});

// ✅ Start server with .env PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;

