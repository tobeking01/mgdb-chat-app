const { model, Schema, ObjectId } = require("mongoose");

const messageSchema = new Schema({
    user: {
        type: {
            id: ObjectId,
            username: String
        },
        required: true,
    },
    roleId: ObjectId,
    orgId: ObjectId,
    room: {
        type: {
            id: ObjectId,
            name: String
        }
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const messageModel = model('Message', messageSchema);

module.exports = messageModel;