const {Router} = require('express');
const {login} = require('../services/userService');

const initRoutes = () => {
    const router = Router();
    router.post('/login', login);
    return router;
}

module.exports = initRoutes;