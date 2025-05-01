const { Router } = require('express');
const { login, getLoggedInUser } = require('../services/userService');
const {
  getMessagesByRoom,
  searchMessages,
  getActiveUsers,
  getActiveChatRooms,
  getLeastActiveUsers,
  sendMessage,
} = require('../services/messageService');
const { getAllRooms } = require('../services/roomService');
const { getAllRoles } = require('../services/roleService');

const initRoutes = () => {
  const router = Router();

  // Auth
  router.post('/login', login);
  router.get('/api/users/me', getLoggedInUser); // ✅ NEW: Get current user profile

  // Chat & Rooms
  router.get('/api/chatrooms', getAllRooms);
  router.get('/api/messages', getMessagesByRoom);
  router.post('/api/messages/send', sendMessage);

  // Analytics & Queries
  router.get('/api/messages/search', searchMessages);
  router.get('/api/chatrooms/active', getActiveChatRooms);
  router.get('/api/users/active', getActiveUsers);
  router.get('/api/users/least-active', getLeastActiveUsers);

  // Roles
  router.get('/api/roles', getAllRoles);

  return router;
};

module.exports = initRoutes;