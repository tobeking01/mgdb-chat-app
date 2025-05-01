const { Message, User } = require('../models/index');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { sendMessageFromSocket } = require('./socketMessageService');

// Get messages in a specific room
const getMessagesByRoom = async (req, res) => {
  const roomId = req.query.roomId;
  console.log(`Query messages from room ${roomId}`);

  try {
    const messages = await Message.find({ 'room.id': roomId })
      .select("room.name user.id user.username text timestamp")
      .sort({ timestamp: -1 })
      .populate('user.id', 'email');

    const formatted = messages.map(message => ({
      username: message.user.username,
      email: message.user.id?.email ?? 'Unknown',
      room: message.room?.name ?? 'Unknown',
      message: message.text,
      timestamp: message.timestamp,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Failed to get messages:", err.message);
    return res.status(500).json({ error: "Failed to get messages" });
  }
};

// Search messages by keyword
const searchMessages = async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.status(400).json({ error: "Missing keyword" });

  try {
    const messages = await Message.find({ text: { $regex: keyword, $options: "i" } })
      .select("room.name user.id user.username text timestamp")
      .sort({ timestamp: -1 })
      .populate('user.id', 'email');

    const formatted = messages.map(message => ({
      username: message.user.username,
      email: message.user.id?.email ?? 'Unknown',
      room: message.room?.name ?? 'Unknown',
      message: message.text,
      timestamp: message.timestamp,
    }));

    return res.status(200).json(formatted);
  } catch (err) {
    console.error("Search failed:", err.message);
    return res.status(500).json({ error: "Failed to search messages" });
  }
};

// Most active users
const getActiveUsers = async (req, res) => {
  try {
    const result = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user.id",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$userDetail" },
      {
        $group: {
          _id: "$userDetail",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          username: "$_id.username",
          email: "$_id.email",
          messagecount: "$count",
        },
      },
    ]);

    return res.json(result);
  } catch (err) {
    console.error("Failed to get active users:", err.message);
    return res.status(500).json({ error: "Failed to get active users" });
  }
};

// Least active users by role
const getLeastActiveUsers = async (req, res) => {
  const roleId = req.query.roleId;
  if (!roleId) return res.status(400).json({ error: "Missing roleId" });

  try {
    const result = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user.id",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      { $unwind: "$user" },
      { $unwind: "$userDetail" },
      {
        $match: {
          "userDetail.roleId": new ObjectId(roleId),
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "userDetail.roleId",
          foreignField: "_id",
          as: "roleDetail",
        },
      },
      { $unwind: "$roleDetail" },
      {
        $group: {
          _id: {
            username: "$userDetail.username",
            email: "$userDetail.email",
            role: "$roleDetail.roleName",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: 1 } },
      {
        $project: {
          _id: 0,
          username: "$_id.username",
          email: "$_id.email",
          role: "$_id.role",
          messagecount: "$count",
        },
      },
    ]);

    return res.json(result);
  } catch (err) {
    console.error("Failed to get least active users:", err.message);
    return res.status(500).json({ error: "Failed to get least active users" });
  }
};

// Most active chat rooms
const getActiveChatRooms = async (req, res) => {
  try {
    const result = await Message.aggregate([
      {
        $group: {
          _id: "$room",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          room: "$_id.name",
          messagecount: "$count",
        },
      },
    ]);

    return res.json(result);
  } catch (err) {
    console.error("Failed to get active chat rooms:", err.message);
    return res.status(500).json({ error: "Failed to get active chat rooms" });
  }
};

// Save new message
const sendMessage = async (req, res) => {
  try {
    const savedMessage = await sendMessageFromSocket(req.body);
    return res.status(201).json({ message: savedMessage });
  } catch (err) {
    console.error("Failed to send message:", err.message);
    return res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = {
  getMessagesByRoom,
  searchMessages,
  getActiveUsers,
  getActiveChatRooms,
  getLeastActiveUsers,
  sendMessage,
};