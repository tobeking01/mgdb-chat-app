const { Room } = require('../models/index');

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    console.log("✅ Rooms found:", rooms.length);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
};

module.exports = {
  getAllRooms,
};
