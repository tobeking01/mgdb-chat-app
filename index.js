const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./db");
const bodyParser = require("body-parser");
const initRoutes = require("./routes/routes");
const initSocket = require("./socket"); // ✅ Import socket setup

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server); // ✅ Create Socket.IO instance

// Initialize WebSocket handlers
initSocket(io); // ✅ Now sets up all socket events in socket.js

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// Routes
app.use("/", initRoutes());

// Start server only after DB connects
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}/login.html`);
      console.log(`🔎 Admin Dashboard: http://localhost:${PORT}/query-page.html`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });