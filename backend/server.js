// This is the entry point - the file you run with `node server.js`.
// Its only job is to wire everything else together: load config, connect
// to the database, mount routes, and start listening for requests.

require("dotenv").config(); // reads .env into process.env before anything else needs it

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const leadRoutes = require("./routes/leadRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB(); // fire off the MongoDB connection early, in the background

const app = express();

// cors() allows the React frontend (running on a different port during
// development) to make requests to this API - without it, browsers block
// the requests by default for security reasons.
// Allow requests from the frontend. In production, FRONTEND_URL should be
// set to the deployed Vercel URL. In development it falls back to any origin.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Built-in Express middleware that parses incoming JSON request bodies
// into req.body - without this, req.body would be undefined.
app.use(express.json());

// A simple root route just to confirm the API is alive when you visit it
// directly in a browser or with curl.
app.get("/", (req, res) => {
  res.json({ message: "Mini CRM API is running" });
});

// Everything under /api/auth goes to authRoutes, everything under
// /api/leads goes to leadRoutes. Keeps the URL structure predictable:
// POST /api/auth/login, GET /api/leads, etc.
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);

// These two must be registered LAST, in this order - notFound catches
// any URL that didn't match a route above, and errorHandler catches
// anything thrown (or passed to next(err)) anywhere in the app.
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
