const { model, Schema, ObjectId } = require("mongoose");

const messageSchema = new Schema({
    user: {
        type: {
            id: ObjectId,
            username: String
        },
        required: true,
    },
    roleId: {
        type: ObjectId,
        ref: 'Role',
    },
    orgId: {
        type:ObjectId,
        ref: 'Organization',
    },
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

const Message = model('Message', messageSchema);

module.exports = Message;