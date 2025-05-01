const { Message, User, Room } = require("../models");

/**
 * Saves a chat message with embedded user and room details.
 * @param {Object} msg - The message data
 * @param {string} msg.email
 * @param {string} msg.roomId
 * @param {string} msg.message
 * @returns {Promise<Object>} saved message
 */
const sendMessageFromSocket = async ({ email, roomId, message }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");

  const savedMessage = await Message.create({
    user: {
      id: user._id,
      username: user.username,
    },
    roleId: user.roleId,
    orgId: user.orgId,
    room: {
      id: room._id,
      name: room.name,
    },
    text: message,
    timestamp: new Date(),
  });

  return savedMessage;
};

module.exports = { sendMessageFromSocket };