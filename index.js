const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./db");
const bodyParser = require("body-parser");
const initRoutes = require("./routes/routes")

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = new Server(server);

// Connect to MongoDB
connectDB();

// Serve static files (frontend)
app.use(express.static("public"));

//Init routes
const router = initRoutes();
app.use('/', router);

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));