// This file's only job is to open a connection to MongoDB before the
// server starts accepting requests. Keeping it separate from server.js
// means we can reuse it (e.g. in tests) without duplicating the setup.

const mongoose = require("mongoose");
const { enableLocalMode } = require("../utils/runtimeMode");

async function connectDB() {
  try {
    // mongoose.connect returns a promise, so we await it. If the URI is
    // wrong or Mongo isn't running, this will throw and we catch it below.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    // Keep the server running so the app still starts in environments
    // where MongoDB is unavailable. Routes that depend on the database
    // will still fail until a valid connection is provided.
    enableLocalMode();
    return null;
  }
}

module.exports = connectDB;
