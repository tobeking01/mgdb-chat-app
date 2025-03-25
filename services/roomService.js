const {Room} = require('../models/index');

const getAllRooms = async (request, response) => {
    const rooms = await Room.find();
    response.json(rooms);
}

module.exports = {
    getAllRooms,
};