Here’s your updated and polished **`README.md`** for the `mgdb-chat-app`:

---

```markdown
# mgdb-chat-app

A minimalistic real-time chat app built with **Node.js**, **Socket.io**, and **MongoDB Atlas** to demonstrate the power of NoSQL for messaging and analytics.

---

## 🚀 Features

- 💬 Real-time chat with **Socket.IO**
- 📦 Persistent message storage via **MongoDB (Mongoose)**
- 🧠 Role-based users, room switching, and activity tracking
- 📊 Admin dashboard with live queries (most active users, keyword search, etc.)
- ⚙️ Express.js backend serving a static Bootstrap-powered frontend

---

## ⚡ Getting Started

### 1️. Clone the Repository

```bash
git clone https://github.com/tobeking01/mgdb-chat-app.git
cd mgdb-chat-app
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file with your MongoDB Atlas connection:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chatDb?retryWrites=true&w=majority
PORT=5000
```

> ✅ Be sure to whitelist your IP on MongoDB Atlas under **Network Access**.

---

### 4️⃣ Start the App

**Development (auto-reload):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

---

## 🧪 Try These URLs

- `http://localhost:5000/login.html` → Log in as a user (email-only auth)
- `http://localhost:5000/chat-page.html` → Join real-time chat rooms
- `http://localhost:5000/query-page.html` → Admin dashboard (messages, roles, stats)

---

## 🛠 Technologies Used

| Tool        | Purpose                           |
|-------------|-----------------------------------|
| Node.js     | Backend runtime                   |
| Express.js  | HTTP server & routing             |
| MongoDB     | NoSQL database (hosted on Atlas)  |
| Mongoose    | ODM for MongoDB                   |
| Socket.IO   | Real-time bi-directional comms    |
| Bootstrap   | UI styling                        |

---

## ✅ Status

- [x] Role-based access & room switching
- [x] Real-time chat + typing indicators
- [x] Query dashboard for admin insights
- [x] Safe session handling via `sessionStorage`
- [ ] Attachments and emoji support (coming soon)

---

📚 Academic Context

This project was developed as part of ICS 611-01: Distributed Database Management (Spring 2025) at Metropolitan State University. 
The course explores modern NoSQL and NewSQL data management systems with an emphasis on scalability, availability, and distributed architectures. 
The mgdb-chat-app serves as a hands-on demonstration of how a document-oriented NoSQL database (MongoDB) can power a real-time chat system using a non-relational, horizontally scalable approach. 
It fulfills multiple phases of the course project including system exploration, setup, application design, use case querying, and transactional evaluation.

---

## 📄 License

MIT © 2025 [Tobechi,Khanh,Zadkiel,Sumangal](https://github.com/tobeking01)
```
