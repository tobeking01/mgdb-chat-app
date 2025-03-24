const {Message, User} = require('../models/index');
const { request } = require('express');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const getMessagesByRoom = async (request, response) => {
    const roomId = request.query.roomId;
    console.log(`Query messages from room ${roomId}`);
    try {
        const messages = await Message.find({'room.id': roomId})
                                    .select("room.name user.id user.username text timestamp")
                                    .sort({timestamp: -1})
                                    .populate('user.id', 'email')
                                    .exec()
                                    .then(messages => {
                                        return messages.map(message => ({
                                                    username: message.user.username,
                                                    email: message.user.id.email,
                                                    room: message.room.name,
                                                    message: message.text,
                                                    timestamp: message.timestamp,
                                            }));
                                    });
        response.status(200).json(messages);
    } catch (e) {
        console.error(e);
        return [];
    }
}

const searchMessages = async (request, response) => {
    const keyword = request.query.keyword;
    console.log(`Search messages by keyword ${keyword}`);
    if (!keyword) {
        console.log('Missing keyword');
        response.json([]);
        return response;
    }
    const result = await Message.find({'text': { "$regex": keyword, "$options": "i" }})
                                .select("room.name user.id user.username text timestamp")
                                .sort({timestamp: -1})
                                .populate('user.id', 'email')
                                .exec()
                                .then(messages => {
                                    return messages.map(message => ({
                                                username: message.user.username,
                                                email: message.user.id.email,
                                                room: message.room.name,
                                                message: message.text,
                                                timestamp: message.timestamp,
                                        }));
                                });                
    response.status(200).json(result);
}

const getActiveUsers = async(request, response) => {
    const aggregatorOpts = [
        {
            $lookup: {
                from: "users",
                localField: "user.id",
                foreignField: "_id",
                as: "userDetail"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $unwind: "$userDetail"
        },
        {
            $group: {
                _id: "$userDetail",
                count: { $sum: 1 }
            },
        },
        {
            $sort: {
                count: -1,
            }
        },
        {
            $project: {
                _id: 0,                     // Exclude the "_id" field
                username: "$_id.username",
                email: "$_id.email",               // Include the grouped field as "item"
                "messagecount": "$count"            // Include the "totalQuantity"
            }
        }
    ];

    const result = await Message.aggregate(aggregatorOpts).exec();
    response.json(result);
}

const getLeastActiveUsers = async(request, response) => {
    const roleId = request.query.roleId;
    console.log(`Find least active user by roleId ${roleId}`);
    if (!roleId) {
        console.log('Missing roleId');
        response.json([]);
        return response;
    }
    const aggregatorOpts = [
        {
            $lookup: {
                from: "users",
                localField: "user.id",
                foreignField: "_id",
                as: "userDetail"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $unwind: "$userDetail"
        },
        {
            $match: {
                'userDetail.roleId': new ObjectId(roleId),
            }

        },
        {
            $group: {
                _id: "$userDetail",
                count: { $sum: 1 }
            },
        },
        {
            $sort: {
                count: 1,
            }
        },
        {
            $project: {
                _id: 0,                     // Exclude the "_id" field
                username: "$_id.username",
                role: "$_id.roleId",
                email: "$_id.email",               // Include the grouped field as "item"
                "messagecount": "$count"            // Include the "totalQuantity"
            }
        }
    ];

    const result = await Message.aggregate(aggregatorOpts).exec();
    response.json(result);
}

const getActiveChatRooms = async(request, response) => {
    const aggregatorOpts = [
        {
            $group: {
                _id: "$room",
                count: { $sum: 1 }
            },
        },
        {
            $sort: {
                count: -1,
            }
        },
        {
            $project: {
                _id: 0,                     // Exclude the "_id" field
                room: "$_id.name",            // Include the grouped field as "item"
                "messagecount": "$count"            // Include the "totalQuantity"
            }
        }
    ];

    const result = await Message.aggregate(aggregatorOpts).exec();
    response.json(result);
}

module.exports = {
    getMessagesByRoom,
    searchMessages,
    getActiveUsers,
    getActiveChatRooms,
    getLeastActiveUsers
};