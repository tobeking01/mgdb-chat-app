const socket = io();
const currentUserEmail = sessionStorage.getItem("chat_email");
if (!currentUserEmail) {
  alert("You must log in first.");
  window.location.href = "/login.html";
}

let currentRoomId = null;

window.onload = async () => {
  await loadRooms();
  await loadUserProfile();
  switchRoom(); // Auto-join first room
  setupTypingListener();
};

// Load chat rooms into dropdown
async function loadRooms() {
  const res = await fetch("/api/chatrooms");
  const rooms = await res.json();

  const select = document.getElementById("roomSelect");
  select.innerHTML = "";
  rooms.forEach(room => {
    const opt = document.createElement("option");
    opt.value = room._id;
    opt.textContent = room.name;
    select.appendChild(opt);
  });

  currentRoomId = select.value;
}

// Switch chat room
function switchRoom() {
  const newRoomId = document.getElementById("roomSelect").value;
  if (currentRoomId) socket.emit("leaveRoom", currentRoomId);
  currentRoomId = newRoomId;
  socket.emit("joinRoom", currentRoomId);
  loadMessages();
}

// Load and show user profile
async function loadUserProfile() {
  try {
    const res = await fetch(`/api/users/me?email=${encodeURIComponent(currentUserEmail)}`);
    const data = await res.json();
    document.getElementById("profileUsername").textContent = data.username || "Unknown";
    document.getElementById("profileEmail").textContent = data.email || "Unknown";
    document.getElementById("profileRole").textContent = data.role || "Unknown";
  } catch (err) {
    console.error("Failed to load user profile:", err.message);
  }
}

// Log out
function logout() {
  sessionStorage.removeItem("chat_email");
  window.location.href = "/login.html";
}

// Load and display messages
async function loadMessages() {
  const res = await fetch(`/api/messages?roomId=${currentRoomId}`);
  const messages = await res.json();

  const box = document.getElementById("chat-box");
  box.innerHTML = "";
  messages.reverse().forEach(msg => {
    const div = createMessageHTML({
      username: msg.username || msg.email?.split("@")[0],
      message: msg.message,
      timestamp: msg.timestamp,
    });
    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}

// Send message via socket (no optimistic render)
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !currentRoomId) return;

  const msg = {
    email: currentUserEmail,
    roomId: currentRoomId,
    message: text,
  };

  socket.emit("message", msg);
  input.value = "";
  document.getElementById("typingIndicator").textContent = "";
}

// Append message to chat box
function appendMessage(msg) {
  const box = document.getElementById("chat-box");
  const div = createMessageHTML({
    username: msg.username || msg.email?.split("@")[0],
    message: msg.message,
    timestamp: msg.timestamp || new Date(),
  });
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

// Generate message HTML
function createMessageHTML({ username, message, timestamp }) {
  const div = document.createElement("div");
  const isValid = timestamp && !isNaN(new Date(timestamp).getTime());
  const time = isValid ? new Date(timestamp).toLocaleTimeString() : "Invalid Time";

  div.innerHTML = `<strong>${username}</strong>: ${message}
    <small class="text-muted float-end">${time}</small>`;
  return div;
}

// Emit typing event
function setupTypingListener() {
  const input = document.getElementById("messageInput");
  input.addEventListener("input", () => {
    if (currentRoomId) {
      socket.emit("typing", {
        roomId: currentRoomId,
        username: currentUserEmail.split("@")[0],
      });
    }
  });
}

// Receive message from server
socket.on("message", (msg) => {
  if (msg.roomId === currentRoomId) {
    appendMessage(msg);
  }
});

// Show typing indicator
socket.on("typing", (data) => {
  const indicator = document.getElementById("typingIndicator");
  indicator.textContent = `${data.username} is typing...`;
  clearTimeout(indicator.timeout);
  indicator.timeout = setTimeout(() => {
    indicator.textContent = "";
  }, 2000);
});

// Optional: handle message status
socket.on("messageStatus", (data) => {
  console.log(`Message ${data.messageId} status: ${data.status}`);
});