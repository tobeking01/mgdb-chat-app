const { User } = require('../models'); // Assumes User is exported from models/index.js

// 🔐 Login endpoint
const login = async (request, response) => {
  const { email } = request.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(401).json({ message: 'Invalid credential' });
    }
    response.json(user);
  } catch (err) {
    console.error("Login error:", err.message);
    response.status(500).json({ error: 'Login failed' });
  }
};

// 👤 Get profile of logged-in user
const getLoggedInUser = async (request, response) => {
  const { email } = request.query;

  try {
    const user = await User.findOne({ email }).populate('roleId', 'roleName');
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    response.json({
      username: user.username,
      email: user.email,
      role: user.roleId?.roleName || 'Unknown',
    });
  } catch (err) {
    console.error("Error loading user:", err.message);
    response.status(500).json({ error: 'Failed to fetch user' });
  }
};

module.exports = {
  login,
  getLoggedInUser
};