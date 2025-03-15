const {Router} = require('express');
const {login} = require('../services/userService');
const {getMessagesByRoom, searchMessages} = require('../services/messageService');

const initRoutes = () => {
    const router = Router();
    router.post('/login', login);
    router.get('/api/messages', getMessagesByRoom);
    router.get('/api/messages/search', searchMessages)
    return router;
}

module.exports = initRoutes;