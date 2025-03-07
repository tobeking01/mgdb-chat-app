const userModel = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { request } = require('express');

const signIn = async (request, response) => {
    const {email} = request.body;
    const user = await userModel.findOne({email: email});
    if (!user) {
        response.status(401).json({message: 'Invalid credential'});
    } else {
        const SECRET_KEY = process.env.SECRET_KEY;
        const token = jwt.sign({ username: user.username, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        response.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        response.json({success: true});
    }
}

const signOut = (request, response) => {
    response.clearCookie('token');
    response.redirect('/login.html');
};

const getCurrentUser = async (request, response) => {
    const currentUser = request.user;
    return response.json(currentUser);
}

module.exports = {
    signIn,
    signOut,
    getCurrentUser,
};