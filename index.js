const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./db");
const bodyParser = require("body-parser");
const initRoutes = require("./routes/routes");

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();

// Create HTTP server and attach socket.io
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend from /public

// Attach routes
const router = initRoutes();
app.use("/", router);


// WebSocket handling
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message", msg); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server only after DB connects
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🔎 Open the Dashboard at: http://localhost:${PORT}/query-page.html`);
    });    
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit with failure
  });