const {Router} = require('express');
const {login} = require('../services/userService');
const {getMessagesByRoom, searchMessages, getActiveUsers, getActiveChatRooms, getLeastActiveUsers} = require('../services/messageService');
const {getAllRooms} = require('../services/roomService');

const initRoutes = () => {
    const router = Router();
    router.post('/login', login);
    router.get('/api/chatrooms', getAllRooms);
    router.get('/api/users/active', getActiveUsers);
    router.get('/api/messages', getMessagesByRoom);
    router.get('/api/chatrooms/active', getActiveChatRooms);
    router.get('/api/users/least-active', getLeastActiveUsers);
    router.get('/api/messages/search', searchMessages);
    return router;
}

module.exports = initRoutes;