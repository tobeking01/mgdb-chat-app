const {Router} = require('express');
const {signIn, signOut, getCurrentUser} = require('../services/authService');

const initRoutes = () => {
    const router = Router();
    router.post('/login', signIn);
    router.get('/current-user', getCurrentUser);
    router.get('/sign-out', signOut);
    return router;
}

module.exports = initRoutes;