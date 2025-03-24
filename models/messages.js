const { model, Schema, ObjectId } = require("mongoose");

const messageSchema = new Schema({
    user: {
        type: {
            id: {
                type: ObjectId,
                ref: 'User',
            },
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
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    }
});

const Message = model('Message', messageSchema);

module.exports = Message;