/* 
  query-page.js

  This file contains the JavaScript logic for our Admin Query Dashboard.
  It handles:
    - switching query sections (showQuery),
    - fetching data from the backend API (fetchQuery),
    - populating the rooms dropdown on load,
    - executing each query function (runQuery1, runQuery2, etc.),
    - and rendering results in a table (displayResultsTable).
*/

/**
 * showQuery(queryId)
 * Hides all .query-section elements, then shows the one matching queryId.
 * Also clears any previous results from #resultsContainer.
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
   * A helper to fetch JSON data from the given URL using a GET request.
   * Returns an array or object, or an empty array if there's an error.
   */
  async function fetchQuery(url) {
    try {
      const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to fetch data. Check the console for details.");
      return [];
    }
  }
  
  /**
   * On window load:
   * - Load the chat room list into #chatRoomSelect
   * - load roles
   */
  window.onload = async () => {
    await loadChatRooms(); // Load rooms
    await loadRoles();     // Load roles
  };
  
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
  
  /**
   * runQuery1(): Fetch messages from the selected chat room
   * Then calls displayResultsTable() to show them.
   */
  async function runQuery1() {
    const roomId = document.getElementById("chatRoomSelect").value;
    if (!roomId) {
      alert("Please select a chat room.");
      return;
    }
    try {
      const results = await fetchQuery(`/api/messages?roomId=${roomId}`);
      displayResultsTable(results, ["username", "email", "room", "message", "timestamp"]);
    } catch (err) {
      console.error("Query 1 failed:", err);
      alert("Failed to fetch messages.");
    }
  }
  
  /**
   * runQuery2(): Finds the most active chat rooms by message count
   * /api/chatrooms/active returns an array of objects with room, messagecount
   */
  async function runQuery2() {
    try {
      const results = await fetchQuery("/api/chatrooms/active");
      displayResultsTable(results, ["room", "messagecount"]);
    } catch (err) {
      console.error("Query 2 failed:", err);
      alert("Failed to fetch active chat rooms.");
    }
  }
  
  /**
   * runQuery3(): Finds the most active users by message count
   * /api/users/active returns array of { username, email, messagecount }
   */
  async function runQuery3() {
    try {
      const results = await fetchQuery("/api/users/active");
      displayResultsTable(results, ["username", "email", "messagecount"]);
    } catch (err) {
      console.error("Query 3 failed:", err);
      alert("Failed to fetch active users.");
    }
  }
  
  /**
   * runQuery4(): Searches messages containing a specific keyword
   * e.g. /api/messages/search?keyword=update
   * Then displays them in the table
   */
  async function runQuery4() {
    const keyword = document.getElementById("keywordInput").value.trim();
    if (!keyword) {
      alert("Please enter a keyword.");
      return;
    }
    try {
      const results = await fetchQuery(`/api/messages/search?keyword=${encodeURIComponent(keyword)}`);
      displayResultsTable(results, ["username", "email", "room", "message", "timestamp"]);
    } catch (err) {
      console.error("Query 4 failed:", err);
      alert("Failed to search messages.");
    }
  }

 // Run Query 5: Least Active Users by Role
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
   * displayResultsTable(data, keys):
   * Takes an array of objects (data) and an array of field names (keys).
   * Renders an HTML table in #resultsContainer.
   */
  function displayResultsTable(data, keys) {
    const container = document.getElementById("resultsContainer");
    if (!data.length) {
      container.innerHTML = "<p>No results found.</p>";
      return;
    }
  
    let html = "<table><thead><tr>";
  
    // Build the header row by capitalizing or spacing out the key names
    keys.forEach(k => {
      html += `<th>${formatHeader(k)}</th>`;
    });
    html += "</tr></thead><tbody>";
  
    // Build a row for each item in the data
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
   * formatHeader(str):
   * Helper to clean up column headers (e.g. "messagecount" -> "Message Count").
   */
  function formatHeader(str) {
    return str
      // Add a space between lowercase and uppercase (if any exist)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      // Capitalize the first character
      .replace(/^./, s => s.toUpperCase())
      // Special-case replacement for "messagecount"
      .replace(/messagecount/i, "Message Count");
  }  