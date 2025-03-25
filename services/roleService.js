const { Role } = require('../models/index');

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    console.log("✅ Roles found:", roles.length);
    res.status(200).json(roles);
  } catch (err) {
    console.error("Error loading roles:", err.message);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

module.exports = { getAllRoles };