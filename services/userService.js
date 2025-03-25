const {User} = require('../models/index');

const login = async (request, response) => {
    const {email} = request.body;
    const user = await User.findOne({email: email});
    if (!user) {
        response.status(401).json({message: 'Invalid credential'});
    } else {
        response.json(user);
    }
}

module.exports = {
    login,
};