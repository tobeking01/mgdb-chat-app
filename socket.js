const { sendMessageFromSocket } = require("./services/socketMessageService");

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    // Join a chat room
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`📥 ${socket.id} joined room ${roomId}`);
    });

    // Leave a room
    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      console.log(`📤 ${socket.id} left room ${roomId}`);
    });

    // Handle incoming messages
    socket.on("message", async (msg) => {
      try {
        await sendMessageFromSocket(msg); // Save to DB
        io.to(msg.roomId).emit("message", msg); // Broadcast to that room only
      } catch (err) {
        console.error("❌ Message error:", err.message);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      // data: { roomId, username }
      socket.to(data.roomId).emit("typing", {
        username: data.username,
      });
    });

    // Message delivery/seen status
    socket.on("messageStatus", (data) => {
      // data: { roomId, messageId, status }
      socket.to(data.roomId).emit("messageStatus", data);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("👋 Disconnected:", socket.id);
    });
  });
}

module.exports = initSocket;