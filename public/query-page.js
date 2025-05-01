/* 
  query-page.js – Admin Query Dashboard Logic
  -------------------------------------------
  Handles:
  - query switching
  - data fetching from backend APIs
  - chat room and role dropdown population
  - rendering result tables
  - session validation and logout
*/

// 🔐 Session check
const currentUserEmail = sessionStorage.getItem("chat_email");
if (!currentUserEmail) {
  alert("You must log in first.");
  window.location.href = "/login.html";
}

// Optional: show email in header
window.onload = async () => {
  const emailDisplay = document.getElementById("adminEmail");
  if (emailDisplay) emailDisplay.textContent = currentUserEmail;

  await loadChatRooms(); // Load rooms
  await loadRoles();     // Load roles
};

/**
 * showQuery(queryId)
 * Hides all .query-section elements, then shows the one matching queryId.
 */
function showQuery(queryId) {
  document.querySelectorAll(".query-section").forEach(section => {
    section.style.display = "none";
  });
  document.getElementById(queryId).style.display = "block";
  document.getElementById("resultsContainer").innerHTML = "";
}

/**
 * fetchQuery(url)
 * Reusable fetch helper for GET requests
 */
async function fetchQuery(url) {
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Failed to fetch data. Check console for details.");
    return [];
  }
}

// Load Chat Rooms
async function loadChatRooms() {
  const select = document.getElementById("chatRoomSelect");
  if (!select) return;
  select.innerHTML = "<option>Loading...</option>";
  try {
    const rooms = await fetchQuery("/api/chatrooms");
    select.innerHTML = rooms.length
      ? rooms.map(r => `<option value="${r._id}">${r.name}</option>`).join('')
      : "<option value=''>No rooms found</option>";
  } catch {
    select.innerHTML = "<option value=''>Error loading rooms</option>";
  }
}

// Load Roles
async function loadRoles() {
  const select = document.getElementById("roleSelect");
  if (!select) return;
  select.innerHTML = "<option>Loading...</option>";
  try {
    const roles = await fetchQuery("/api/roles");
    select.innerHTML = roles.length
      ? roles.map(role => `<option value="${role._id}">${role.roleName}</option>`).join('')
      : "<option value=''>No roles found</option>";
  } catch {
    select.innerHTML = "<option value=''>Error loading roles</option>";
  }
}

// Query 1: Messages in a chat room
async function runQuery1() {
  const roomId = document.getElementById("chatRoomSelect").value;
  if (!roomId) return alert("Please select a chat room.");
  try {
    const results = await fetchQuery(`/api/messages?roomId=${roomId}`);
    displayResultsTable(results, ["username", "email", "room", "message", "timestamp"]);
  } catch (err) {
    console.error("Query 1 failed:", err);
    alert("Failed to fetch messages.");
  }
}

// Query 2: Most active chat rooms
async function runQuery2() {
  try {
    const results = await fetchQuery("/api/chatrooms/active");
    displayResultsTable(results, ["room", "messagecount"]);
  } catch (err) {
    console.error("Query 2 failed:", err);
    alert("Failed to fetch active chat rooms.");
  }
}

// Query 3: Most active users
async function runQuery3() {
  try {
    const results = await fetchQuery("/api/users/active");
    displayResultsTable(results, ["username", "email", "messagecount"]);
  } catch (err) {
    console.error("Query 3 failed:", err);
    alert("Failed to fetch active users.");
  }
}

// Query 4: Search by keyword
async function runQuery4() {
  const keyword = document.getElementById("keywordInput").value.trim();
  if (!keyword) return alert("Please enter a keyword.");
  try {
    const results = await fetchQuery(`/api/messages/search?keyword=${encodeURIComponent(keyword)}`);
    displayResultsTable(results, ["username", "email", "room", "message", "timestamp"]);
  } catch (err) {
    console.error("Query 4 failed:", err);
    alert("Failed to search messages.");
  }
}

// Query 5: Least active users by role
async function runQuery5() {
  const roleId = document.getElementById("roleSelect").value;
  if (!roleId) return alert("Please select a role.");
  try {
    const results = await fetchQuery(`/api/users/least-active?roleId=${roleId}`);
    displayResultsTable(results, ["username", "email", "role", "messagecount"]);
  } catch (err) {
    console.error("Query 5 failed:", err);
    alert("Failed to fetch least active users.");
  }
}

/**
 * displayResultsTable(data, keys)
 * Renders a table inside #resultsContainer
 */
function displayResultsTable(data, keys) {
  const container = document.getElementById("resultsContainer");
  if (!data.length) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  let html = "<table class='table table-bordered table-striped'><thead><tr>";
  keys.forEach(k => {
    html += `<th>${formatHeader(k)}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach(row => {
    html += "<tr>";
    keys.forEach(k => {
      html += `<td>${row[k] ?? "-"}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

/**
 * formatHeader(str)
 * Cleans up table column headers.
 */
function formatHeader(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, s => s.toUpperCase())
    .replace(/messagecount/i, "Message Count");
}

/**
 * logout()
 * Clears session and redirects to login.
 */
function logout() {
  sessionStorage.removeItem("chat_email");
  window.location.href = "/login.html";
}