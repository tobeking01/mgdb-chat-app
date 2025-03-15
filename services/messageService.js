const {Message} = require('../models/index');
const { request } = require('express');

const getMessagesByRoom = async (request, response) => {
    const roomId = request.query.roomId;
    console.log(`Query messages from room ${roomId}`);
    try {
        const messages = await Message.find({'room.id': roomId}).sort({timestamp: -1});
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
    const messages = await Message.find({'text': { "$regex": keyword, "$options": "i" }}).sort({timestamp: -1});
    response.status(200).json(messages);
}

module.exports = {
    getMessagesByRoom,
    searchMessages,
};